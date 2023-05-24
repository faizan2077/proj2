import {
  Button,
  Card,
  Collapse,
  Divider,
  Empty,
  Input,
  List,
  Modal,
  Typography,
} from "antd";
import "./App.css";
import {
  PlusSquareOutlined,
  EditOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { useState } from "react";

const { Panel } = Collapse;
function App() {
  const [addMenuItemVisible, setAddMenuItemVisible] = useState(false);
  const [editMenuItemVisible, setEditMenuItemVisible] = useState(false);
  const [addChildMenuItemVisible, setAddChildMenuItemVisible] = useState(false);
  const [editChileMenuItemVisible, setEditChildMenuItemVisible] =
    useState(false);
  const [editChileMenuItem, setEditChildMenuItem] = useState({
    childIndex: null,
    parentIndex: null,
  });
  const [menuItemKey, setMenuItemKey] = useState(0);
  const [menuItemName, setMenuItemName] = useState("");
  const [menuItems, setMenuItems] = useState([]);
  const handleChange = ({ target }) => {
    setMenuItemName(target.value);
  };

  const submitAddItem = () => {
    const obj = {
      title: menuItemName,
      children: [],
    };
    setMenuItems([...menuItems, obj]);
    setAddMenuItemVisible(false);
    setMenuItemName("");
  };

  const handleCancel = () => {
    setAddMenuItemVisible(false);
    setEditMenuItemVisible(false);
    setAddChildMenuItemVisible(false);
    setEditChildMenuItemVisible(false);
  };
  const addMenuItem = () => {
    setAddMenuItemVisible(true);
  };
  const editMenuItem = (key) => {
    setMenuItemKey(key);
    setEditMenuItemVisible(true);
    setMenuItemName(menuItems[key].title);
  };
  const handleEditSubmit = () => {
    const updatedItems = menuItems.map((item, index) => {
      if (index === menuItemKey) {
        return { ...item, title: menuItemName };
      }
      return item;
    });
    setMenuItems(updatedItems);
    setEditMenuItemVisible(false);
  };

  const handleDelete = (key) => {
    setMenuItems((prevMenuItems) =>
      prevMenuItems.filter((_, index) => index !== key)
    );
    setMenuItemName("");
  };

  const handleChildAdd = (key, i) => {
    setEditChildMenuItem({
      childIndex: key,
      parentIndex: i,
    });
    setMenuItemName("");
    setAddChildMenuItemVisible(true);
  };
  const handleChildEdit = (key, i) => {
    setEditChildMenuItem({
      childIndex: key,
      parentIndex: i,
    });
    setMenuItemName(menuItems[i].children[key].title);
    setEditChildMenuItemVisible(true);
  };

  const handleChildEditSubmit = () => {
    const { childIndex, parentIndex } = editChileMenuItem;
    const updatedItems = menuItems.map((item, ind) => {
      if (ind === parentIndex) {
        const updatedChild = item.children.map((childItem, index) => {
          if (index === childIndex) {
            return { title: menuItemName };
          }
          return childItem;
        });
        return {
          ...item,
          children: updatedChild,
        };
      }
      return item;
    });
    setMenuItems(updatedItems);
    setMenuItemName("");
    setEditChildMenuItem({
      childIndex: null,
      parentIndex: null,
    });
    setEditChildMenuItemVisible(false);
  };

  const handleChildAddSubmit = () => {
    const { parentIndex } = editChileMenuItem;
    const updatedItems = menuItems.map((item, ind) => {
      if (ind === parentIndex) {
        const updatedChild = [...item.children, { title: menuItemName }];
        return {
          ...item,
          children: updatedChild,
        };
      }
      return item;
    });
    setMenuItems(updatedItems);
    setMenuItemName("");
    setEditChildMenuItem({
      childIndex: null,
      parentIndex: null,
    });
    setAddChildMenuItemVisible(false);
  };
  const handleChildDelete = (key, i) => {
    const updatedItems = menuItems.map((item, index) => {
      if (index === i) {
        const updatedChild = item.children.filter((_, index) => index !== key);
        return {
          ...item,
          children: updatedChild,
        };
      }
      return item;
    });
    setMenuItems(updatedItems);
    setMenuItemName("");
  };

  const genExtra = (key) => (
    <>
      <EditOutlined
        style={{ color: "#0bb6ef" }}
        className="menu-item-icon"
        onClick={() => editMenuItem(key)}
      />
      <DeleteOutlined
        style={{ color: "#ff0000" }}
        className="menu-item-icon"
        onClick={() => handleDelete(key)}
      />
    </>
  );
  console.log(menuItems);
  return (
    <div className="center">
      <Card title="Menu Items" style={{ width: 700, margin: "50px 0" }}>
        <Collapse ghost>
          {menuItems.length <= 0 ? (
            <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className="empty" />
          ) : (
            menuItems.map(({ title, children }, i) => (
              <Panel
                header={title}
                extra={genExtra(i)}
                key={i}
                style={{
                  borderBottom:
                    menuItems.length - 1 === i
                      ? "none"
                      : ".5px solid #dbd6d670",
                }}
              >
                <List
                  footer={
                    <Button
                      onClick={() => handleChildAdd(null, i)}
                      icon={<PlusSquareOutlined />}
                      type="text"
                      style={{ color: "#0bb6ef" }}
                    >
                      Add menu item to {title}
                    </Button>
                  }
                  bordered
                  dataSource={children}
                  renderItem={(item, childIndex) => (
                    <List.Item>
                      <Typography.Text>{item.title}</Typography.Text>
                      <div>
                        <EditOutlined
                          style={{ color: "#0bb6ef" }}
                          className="menu-item-icon"
                          onClick={() => handleChildEdit(childIndex, i)}
                        />
                        <DeleteOutlined
                          style={{ color: "#ff0000" }}
                          className="menu-item-icon"
                          onClick={() => handleChildDelete(childIndex, i)}
                        />
                      </div>
                    </List.Item>
                  )}
                />
              </Panel>
            ))
          )}
        </Collapse>
        <Divider />
        <Button
          onClick={() => addMenuItem()}
          icon={<PlusSquareOutlined />}
          type="text"
          style={{ color: "#0bb6ef" }}
        >
          Add Menu Item
        </Button>
      </Card>
      <Modal
        title="Add Menu Item"
        open={addMenuItemVisible}
        onOk={submitAddItem}
        onCancel={handleCancel}
      >
        <Input value={menuItemName} onChange={handleChange} />
      </Modal>
      <Modal
        title="Edit Menu Item"
        open={editMenuItemVisible}
        onOk={handleEditSubmit}
        onCancel={handleCancel}
      >
        <Input value={menuItemName} onChange={handleChange} />
      </Modal>
      <Modal
        title="Add Menu Child Item"
        open={addChildMenuItemVisible}
        onOk={handleChildAddSubmit}
        onCancel={handleCancel}
      >
        <Input value={menuItemName} onChange={handleChange} />
      </Modal>
      <Modal
        title="Edit Menu Child Item"
        open={editChileMenuItemVisible}
        onOk={handleChildEditSubmit}
        onCancel={handleCancel}
      >
        <Input value={menuItemName} onChange={handleChange} />
      </Modal>
    </div>
  );
}

export default App;
