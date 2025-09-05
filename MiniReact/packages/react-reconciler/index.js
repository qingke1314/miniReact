// packages/react-reconciler/index.js

// ============ 全局变量定义 ============
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;
let wipFiber = null;
let hookIndex = null;
let allEffects = [];
let rootDoesHaveUpdates = false; // <-- NEW: 调度标志位
const REACT_MEMO_TYPE = Symbol.for("react.memo");

// --- NEW: 调度函数 ---
function scheduleUpdateOnFiber(fiber) {
  // 沿着return指针向上标记更新路径
  let node = fiber;
  while (node) {
    node.needsUpdate = true; // <-- FIX: 修正拼写错误
    node = node.return;
  }

  // 标记根节点存在更新，并触发一次 workLoop
  if (!rootDoesHaveUpdates) {
    rootDoesHaveUpdates = true; // <-- 标记
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
      needsUpdate: true, // <-- NEW: 标记根节点需要更新
    }
    nextUnitOfWork = wipRoot;
    deletions = [];
  }
}

// ============ 平台注入 ============
let hostConfig = {
  createDom: () => { throw new Error('Host config not injected.') },
  updateDom: () => { throw new Error('Host config not injected.') },
};

function inject(config) {
  hostConfig = { ...hostConfig, ...config };
}

// ============ 协调 (Reconciliation) ============
function reconcileChildren(fiber, elements) {
  const oldFiberMap = new Map();
  let oldFiber = fiber.alternate?.child;
  let i = 0;
  while (oldFiber) {
    const key = oldFiber.key ?? i;
    oldFiberMap.set(key, { fiber: oldFiber, index: i });
    oldFiber = oldFiber.sibling;
    i++;
  }

  let prevSibling = null;
  let lastPlacedIndex = 0;

  for (let index = 0; index < elements.length; index++) {

    const element = elements[index];
    const key = element.key ?? index;
    const oldFiberMatch = oldFiberMap.get(key);
    let newFiber = null;

    if (oldFiberMatch) {
      const oldIndex = oldFiberMatch.index;
      const oldActualFiber = oldFiberMatch.fiber;

      if (element.type === oldActualFiber.type) {
        newFiber = {
          type: oldActualFiber.type,
          props: element.props,
          dom: oldActualFiber.dom, // 复用 DOM 节点
          key,
          return: fiber,
          alternate: oldActualFiber, // 正确设置 alternate 指针
          effectTag: 'UPDATE',
          needsUpdate: oldActualFiber.needsUpdate, // 正确传递更新状态
          hooks: oldActualFiber.hooks, // 复用 hooks 数组以便 useState 能够找到旧状态
        };
        if (oldIndex < lastPlacedIndex) {
          newFiber.effectTag = 'PLACEMENT';
        } else {
          lastPlacedIndex = oldIndex;
        }
      } else {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          key,
          return: fiber,
          alternate: null,
          effectTag: 'PLACEMENT',
        };
        oldActualFiber.effectTag = "DELETION";
        deletions.push(oldActualFiber);
      }
      oldFiberMap.delete(key);
    } else {
      newFiber = {
        type: element.type,
        props: element.props,
        dom: null,
        key,
        return: fiber,
        alternate: null,
        effectTag: 'PLACEMENT',
      };
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }

  oldFiberMap.forEach(match => {
    match.fiber.effectTag = "DELETION";
    deletions.push(match.fiber);
  });
}

// ============ 渲染阶段 (Render Phase) ============
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  wipFiber.effects = [];

  // 如果是 memo 组件，真正的组件函数在 .type 属性上
  const Component = fiber.type.$$typeof === REACT_MEMO_TYPE
    ? fiber.type.type
    : fiber.type;

  const children = [Component(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = hostConfig.createDom(fiber);
  }
  reconcileChildren(fiber, fiber.props.children);
}

function shallowEqual(objA, objB) {
  if (Object.is(objA, objB)) return true;
  if (typeof objA !== 'object' || objA === null || typeof objB !== 'object' || objB === null) return false;
  const excludeKeys = ['children'];
  const keysA = Object.keys(objA).filter(key => !excludeKeys.includes(key));
  const keysB = Object.keys(objB).filter(key => !excludeKeys.includes(key));
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (!Object.prototype.hasOwnProperty.call(objB, keysA[i]) || !Object.is(objA[keysA[i]], objB[keysA[i]])) return false;
  }
  return true;
}

// --- NEW: 补全 bail out 需要的辅助函数 ---
function cloneChildFibers(fiber) {
  const alternate = fiber.alternate;
  if (!alternate || !alternate.child) {
    return;
  }

  let oldChild = alternate.child;
  let prevChild = null;

  while (oldChild) {
    const newChild = {
      type: oldChild.type,
      props: oldChild.props,
      key: oldChild.key,
      dom: oldChild.dom,
      return: fiber, // <-- 关键：将 parent 指向新的 wip fiber
      alternate: oldChild,
      effectTag: 'UPDATE', // 标记为 UPDATE 即可，commit 阶段会跳过无变化的更新
      needsUpdate: false, // 子节点也继承“无需更新”的状态
    };

    if (prevChild) {
      prevChild.sibling = newChild;
    } else {
      fiber.child = newChild;
    }
    prevChild = newChild;
    oldChild = oldChild.sibling;
  }
}

function completeUnitOfWork(fiber) {
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }
  return null;
}

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  let shouldBailOut = false;

  // 检查 fiber.type 是否是 memoized 组件
  const isMemoComponent = fiber.type && fiber.type.$$typeof === REACT_MEMO_TYPE;

  if (isMemoComponent) {
    const alternate = fiber.alternate;
    if (alternate && !fiber.needsUpdate) {
      // 应该直接比较新旧两个 Fiber 节点的 props
      if (shallowEqual(fiber.props, alternate.props)) { // <-- 已修正
        shouldBailOut = true;
      }
    }
  }

  if (shouldBailOut) {
    cloneChildFibers(fiber);
    return completeUnitOfWork(fiber);
  }

  // isFunctionComponent 的判断也需要调整，以处理 memo 对象
  if (isFunctionComponent || isMemoComponent) {
    // 对于 memo 组件，我们需要调用其内部的原始组件 fiber.type.type
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

  fiber.needsUpdate = false;

  if (fiber.child) {
    return fiber.child;
  }

  return completeUnitOfWork(fiber);
}

function workLoop(deadline) {
  let shouldYield = false;
  while (nextUnitOfWork && !shouldYield) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    shouldYield = deadline.timeRemaining() < 1;
  }

  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }

  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

// ============ 提交阶段 (Commit Phase) ============
function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.child);

  allEffects.forEach(effect => {
    if (effect.cleanup) effect.cleanup();
    const newCleanup = effect.callback();
    if (newCleanup) effect.cleanup = newCleanup;
    delete effect.callback;
  });
  allEffects = [];

  currentRoot = wipRoot;
  wipRoot = null;
  rootDoesHaveUpdates = false; // <-- FIX: 重置调度标志位，允许下一次更新
}

function commitWork(fiber) {
  if (!fiber) return;

  let domParentFiber = fiber.return;
  while (domParentFiber && !domParentFiber.dom) {
    domParentFiber = domParentFiber.return;
  }
  // 如果 domParentFiber 为 null，说明已经到达根节点之上，直接返回
  if (!domParentFiber) {
    return;
  }
  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "PLACEMENT") {
    let childWithDom = fiber;
    // 如果当前 fiber 没有 dom，就向下寻找第一个有 dom 的子节点
    while (!childWithDom.dom) {
      childWithDom = childWithDom.child;
    }

    // 寻找插入的锚点（下一个兄弟DOM节点）
    let referenceNode = null;
    let nextSibling = fiber.sibling;
    while (nextSibling) {
      if (nextSibling.effectTag !== 'PLACEMENT' && nextSibling.dom) {
        referenceNode = nextSibling.dom;
        break;
      }
      nextSibling = nextSibling.sibling;
    }

    domParent.insertBefore(childWithDom.dom, referenceNode);

  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    hostConfig.updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETION") {
    commitDeletion(fiber, domParent);
    // Deletion 需要提前返回，因为它已经处理了整个子树
    return;
  }

  // 正常遍历子节点和兄弟节点
  commitWork(fiber.child);
  commitWork(fiber.sibling);
}

function commitDeletion(fiber, domParent) {
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

// ============ Hooks 实现 ============
function useState(initial) {
  const fiber = wipFiber;
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];

  const hook = {
    state: oldHook ? oldHook.state : typeof initial === 'function' ? initial() : initial,
    queue: [], // <-- FIX: queue 只用来暂存新 updates
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach(action => {
    hook.state = typeof action === 'function' ? action(hook.state) : action;
  });

  const setState = action => {
    // FIX: 只推送 action 本身，而不是一个 updateEvent 对象
    hook.queue.push(action);
    scheduleUpdateOnFiber(fiber);
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

// ... 其他 Hooks 保持不变 ...
function useEffect(callback, deps) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hasChanged = !deps || !oldHook || deps.some((dep, i) => dep !== oldHook.deps[i]);
  const effect = { callback, deps, cleanup: oldHook?.cleanup };
  if (hasChanged) wipFiber.effects.push(effect);
  wipFiber.hooks.push(effect);
  hookIndex++;
}
function useMemo(createFn, deps) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hasChanged = !deps || !oldHook || deps.some((dep, i) => dep !== oldHook.deps[i]);
  const hook = { memoizedValue: hasChanged ? createFn() : oldHook.memoizedValue, deps };
  wipFiber.hooks.push(hook);
  hookIndex++;
  return hook.memoizedValue;
}
function useCallback(callback, deps) {
  return useMemo(() => callback, deps);
}
function useRef(initialValue) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hook = oldHook ? oldHook : { current: initialValue };
  wipFiber.hooks.push(hook);
  hookIndex++;
  return hook;
}

/**
 * 1、在memo组件的父亲调和时，为memo组件生成的fiber的type为memoizedComponent，props照传
 * 2、在为memo fiber进行调和时，使用fiber.type.type()生成组件，props照传（此处对比props和key，一致则复用旧树）
 * 3、在提交阶段时，会发现类型为placement的fiber，但他的dom为null，因为memo组件的dom是他的子组件的dom，所以递归寻找子组件的dom然后挂载到其父亲的dom上
 * @param {Function} Component 函数组件
 * @returns {Object} 包裹后缓更新的组件
 */
function memo(Component) {
  const memoizedComponent = {
    $$typeof: REACT_MEMO_TYPE,
    type: Component,
  };
  return memoizedComponent;
}

// ============ Reconciler 公共 API ============
function createRoot(element, container) {

  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
    needsUpdate: currentRoot?.needsUpdate
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}

export const reconciler = {
  createRoot,
  inject,
  useState,
  useEffect,
  useMemo,
  memo,
  useCallback,
  useRef
};