import { Outlet } from "react-router-dom";
import { Button } from "antd";

const Tab2 = () => {
  return (
    <div>
      <Button>这是button</Button>
      <Outlet />
    </div>
  );
};

export default Tab2;
