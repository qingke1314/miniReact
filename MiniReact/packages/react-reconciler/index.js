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
function scheduleUpdateOnFiber(fiberKey) {
  let fiber = currentRoot;
  // 使用 Map 替代 WeakMap，因为 fiberKey 可能是数字
  const findItem = (root, keyToFind) => {
    if (!root) return null;
    const stack = [root];
    const visited = new Set();
    while (stack.length > 0) {
      const node = stack.pop();
      if (!node || visited.has(node.fiberKey)) {
        continue;
      }
      visited.add(node.fiberKey);
      if (node.fiberKey === keyToFind) {
        return node;
      }
      // 为了模拟深度优先，先将兄弟节点入栈，再将子节点入栈
      if (node.sibling) {
        stack.push(node.sibling);
      }
      if (node.child) {
        stack.push(node.child);
      }
    }
    return null;
  };

  const item = findItem(currentRoot, fiberKey); // <-- 确保这里传入了 currentRoot 和 fiberKey
  if (!item) {
    console.warn("Could not find fiber to schedule update on.", fiberKey);
    return;
  }
  if (!item) {
    return;
  }
  // 沿着return指针向上标记更新路径
  let node = item;
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
      fiberKey: currentRoot.fiberKey,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  }
}

// ============ 平台注入 ============
let hostConfig = {
  createDom: () => {
    throw new Error("Host config not injected.");
  },
  updateDom: () => {
    throw new Error("Host config not injected.");
  },
};

function inject(config) {
  hostConfig = { ...hostConfig, ...config };
}

// suipian/MiniReact/packages/react-reconciler/index.js

// ============ 协调 (Reconciliation) ============
function reconcileChildren(fiber, elements) {
  // --- DEBUG START ---
  console.group(
    `reconcileChildren for [${
      typeof fiber.type === "function" ? fiber.type.name : fiber.type
    }]`
  );
  console.log("Parent Fiber:", fiber);
  console.log("New Elements:", elements);
  // --- DEBUG END ---

  const oldFiberMap = new Map();
  let oldFiber = fiber.alternate?.child;
  let i = 0;
  while (oldFiber) {
    const key = oldFiber.key ?? i;
    oldFiberMap.set(key, { fiber: oldFiber, index: i });
    oldFiber = oldFiber.sibling;
    i++;
  }

  // --- DEBUG START ---
  console.log("Constructed oldFiberMap:", new Map(oldFiberMap));
  // --- DEBUG END ---

  let prevSibling = null;
  let lastPlacedIndex = 0;

  for (let index = 0; index < elements.length; index++) {
    const element = elements[index];
    const key = element.key ?? index;
    const oldFiberMatch = oldFiberMap.get(key);
    let newFiber = null;

    // --- DEBUG START ---
    console.log(`Processing element at index ${index} with key:`, key);
    if (oldFiberMatch) {
      console.log("FOUND match in oldFiberMap:", oldFiberMatch.fiber);
    } else {
      console.log("NO match found in oldFiberMap.");
    }
    // --- DEBUG END ---

    if (oldFiberMatch) {
      const oldIndex = oldFiberMatch.index;
      const oldActualFiber = oldFiberMatch.fiber;

      if (element.type === oldActualFiber.type) {
        newFiber = {
          type: oldActualFiber.type,
          props: element.props,
          dom: oldActualFiber.dom,
          key,
          return: fiber,
          alternate: oldActualFiber,
          effectTag: "UPDATE",
          needsUpdate: oldActualFiber.needsUpdate,
          hooks: oldActualFiber.hooks,
          fiberKey: oldActualFiber.fiberKey,
        };
        if (oldIndex < lastPlacedIndex) {
          newFiber.effectTag = "PLACEMENT";
        } else {
          lastPlacedIndex = oldIndex;
        }
        // --- DEBUG START ---
        console.log(`-> Reusing Fiber. New effectTag: ${newFiber.effectTag}`);
        // --- DEBUG END ---
      } else {
        newFiber = {
          type: element.type,
          props: element.props,
          dom: null,
          key,
          return: fiber,
          alternate: null,
          effectTag: "PLACEMENT",
          fiberKey: Math.random() * Math.random(),
        };
        oldActualFiber.effectTag = "DELETION";
        deletions.push(oldActualFiber);
        // --- DEBUG START ---
        console.error(
          "-> Type mismatch! Old fiber marked for DELETION, new fiber created with PLACEMENT."
        );
        // --- DEBUG END ---
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
        effectTag: "PLACEMENT",
        fiberKey: Math.random() * Math.random(),
      };
      // --- DEBUG START ---
      console.log("-> Creating new Fiber with PLACEMENT.");
      // --- DEBUG END ---
    }

    if (index === 0) {
      fiber.child = newFiber;
    } else if (prevSibling) {
      prevSibling.sibling = newFiber;
    }
    prevSibling = newFiber;
  }

  // --- DEBUG START ---
  console.log("Remaining fibers in oldFiberMap to be deleted:", oldFiberMap);
  // --- DEBUG END ---
  oldFiberMap.forEach((match) => {
    match.fiber.effectTag = "DELETION";
    deletions.push(match.fiber);
  });

  // --- DEBUG START ---
  console.groupEnd();
  // --- DEBUG END ---
}

// ============ 渲染阶段 (Render Phase) ============
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  wipFiber.effects = [];

  // 如果是 memo 组件，真正的组件函数在 .type 属性上
  const Component =
    fiber.type.$$typeof === REACT_MEMO_TYPE ? fiber.type.type : fiber.type;

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
  if (
    typeof objA !== "object" ||
    objA === null ||
    typeof objB !== "object" ||
    objB === null
  )
    return false;
  const excludeKeys = ["children"];
  const keysA = Object.keys(objA).filter((key) => !excludeKeys.includes(key));
  const keysB = Object.keys(objB).filter((key) => !excludeKeys.includes(key));
  if (keysA.length !== keysB.length) return false;
  for (let i = 0; i < keysA.length; i++) {
    if (
      !Object.prototype.hasOwnProperty.call(objB, keysA[i]) ||
      !Object.is(objA[keysA[i]], objB[keysA[i]])
    )
      return false;
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
      effectTag: "UPDATE", // 标记为 UPDATE 即可，commit 阶段会跳过无变化的更新
      needsUpdate: false, // 子节点也继承“无需更新”的状态
      fiberKey: oldChild.fiberKey,
      hooks: oldChild.hooks,
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

function performUnitOfWork(fiber) {
  const isFunctionComponent = fiber.type instanceof Function;
  const isMemoComponent = fiber.type && fiber.type.$$typeof === REACT_MEMO_TYPE;
  let shouldBailOut = false;

  if (isMemoComponent) {
    const alternate = fiber.alternate;
    if (alternate && !fiber.needsUpdate) {
      if (shallowEqual(fiber.props, alternate.props)) {
        shouldBailOut = true;
      }
    }
  }

  if (shouldBailOut) {
    // 【修复】Bailout 时，只克隆子节点，然后让函数走到统一的出口逻辑
    cloneChildFibers(fiber);
  } else {
    // 正常更新路径
    if (isFunctionComponent || isMemoComponent) {
      updateFunctionComponent(fiber);
    } else {
      updateHostComponent(fiber);
    }
  }

  // 【修复】将寻找下一个工作单元的逻辑统一放在函数末尾
  // 无论是否 bailout，只要产生了子节点，就应该先处理子节点
  if (fiber.child) {
    return fiber.child;
  }

  // 如果没有子节点，才向上寻找兄弟或父节点
  // 使用一个循环来处理，避免深层嵌套的组件没有兄弟节点时直接返回 null
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.return;
  }

  return null;
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

  allEffects.forEach((effect) => {
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
      if (nextSibling.effectTag !== "PLACEMENT" && nextSibling.dom) {
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

/**
 * 递归删除 fiber 树中的节点
 * @param {Fiber} fiber - 要删除的 fiber 节点
 * @param {DOMElement} domParent - 父 DOM 节点
 */
function commitDeletion(fiber, domParent) {
  let node = fiber;
  while (true) {
    // 如果当前节点有 DOM，直接删除
    if (node.dom) {
      domParent.removeChild(node.dom);
      // 同时也可以在这里处理 useEffect 的 cleanup 函数
    }
    // 如果它没有 DOM，但有子节点，就深入子节点
    else if (node.child) {
      node = node.child;
      continue;
    }

    if (node === fiber) {
      // 如果已经回到了最初的 fiber，说明整棵树都处理完了
      return;
    }

    // 向上回溯，直到找到有兄弟节点的祖先
    while (node.sibling === null) {
      if (node.return === null || node.return === fiber) {
        // 如果回溯到了根节点或最初的 fiber，结束
        return;
      }
      node = node.return;
    }

    // 处理兄弟节点
    node = node.sibling;
  }
}

// ============ Hooks 实现 ============
function useState(initial) {
  const fiber = wipFiber;
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hook = {
    state: oldHook
      ? oldHook.state
      : typeof initial === "function"
      ? initial()
      : initial,
    queue: oldHook ? oldHook.queue : [], // <-- FIX: queue 只用来暂存新 updates
  };
  hook.queue.forEach((action) => {
    hook.state = typeof action === "function" ? action(hook.state) : action;
  });
  /**
   * queue一直是同一个，只有memoizedState每次都重新算
   */
  hook.queue.length = 0; // 不改变hook地址的情况下清空已执行action
  const setState = (action) => {
    // FIX: 只推送 action 本身，而不是一个 updateEvent 对象
    hook.queue.push(action);
    scheduleUpdateOnFiber(fiber.fiberKey);
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

// ... 其他 Hooks 保持不变 ...
function useEffect(callback, deps) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hasChanged =
    !deps || !oldHook || deps.some((dep, i) => dep !== oldHook.deps[i]);
  const effect = { callback, deps, cleanup: oldHook?.cleanup };
  if (hasChanged) wipFiber.effects.push(effect);
  wipFiber.hooks.push(effect);
  hookIndex++;
}
function useMemo(createFn, deps) {
  const oldHook = wipFiber.alternate?.hooks?.[hookIndex];
  const hasChanged =
    !deps || !oldHook || deps.some((dep, i) => dep !== oldHook.deps[i]);
  const hook = {
    memoizedValue: hasChanged ? createFn() : oldHook.memoizedValue,
    deps,
  };
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
    // 使用 Symbol 作为 fiberKey，确保它是唯一的对象
    fiberKey: currentRoot?.needsUpdate ? currentRoot.fiberKey : Symbol(),
    alternate: currentRoot,
    needsUpdate: currentRoot?.needsUpdate,
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
  useRef,
};
