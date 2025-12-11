"use client";

import { useEffect, useState } from "react";
import copyright from "../assets/copyright_24dp_000000.svg";
import eddit from "../assets/edit_24dp_666666_FILL0_wght400_GRAD0_opsz24.svg";
import remove from "../assets/delete_24dp_EA3323_FILL0_wght400_GRAD0_opsz24.svg";
import check from "../assets/check_24dp_75FB4C_FILL0_wght400_GRAD0_opsz24.svg";

import { Icon } from "@iconify/react";

export default function Home() {
  const [showForm, setShowForm] = useState(false);

  const [lists, setLists] = useState(() => {
    const saved = localStorage.getItem("lists");
    return saved ? JSON.parse(saved) : [];
  });

  const [currentListIndex, setCurrentListIndex] = useState(null);
  const [stopAnimation, setStopAnimation] = useState(false);
  const [itemForm, setItemForm] = useState({
    name: "",
    quantity: 1,
    estimate: 0,
    totalEstimate: 0,
  });

  // const [listTitle, setListTitle] = useState("");

  // const [listTitle, setListTitle] = useState(() => {
  //   return localStorage.getItem("listTitle") || "";
  // });

  // useEffect(() => {
  //   if (!lists.length) return;
  //   if (currentListIndex === null) {
  //     setCurrentListIndex(0);
  //   }
  // }, [lists, currentListIndex]);
  useEffect(() => {
    if (lists.length > 0 && currentListIndex === null) {
      setCurrentListIndex(0);
    }
  }, [currentListIndex, lists.length]);

  useEffect(() => {
    localStorage.setItem("lists", JSON.stringify(lists));
  }, [lists]);

  // useEffect(() => {
  //   localStorage.setItem("listTitle", listTitle);
  // }, [listTitle]);

  // const openListForm = () => {
  //     const listTitle = prompt("What recipe create?");
  //     if (listTitle) {
  //       setItems((prev) => [...prev, { title:listTitle,data: {}
  // }]);
  //     }
  //     setShowForm(true)
  // }
  const openListForm = () => {
    const title = prompt("What recipe create?");

    if (title && title.trim() !== "") {
      const newList = {
        title,
        items: [],
      };

      setLists((prev) => {
        const updated = [...prev, newList];

        // const newIndex = updated.length - 1;
        setCurrentListIndex(prev.length);

        return updated;
      });

      // setListTitle(title);
      // setCurrentListIndex(lists.length);

      // setItems((prev) => [...prev, { title, data: {} }]);
    }
    setStopAnimation(true);
  };

  const [edit, setEdit] = useState({
    isSet: false,
    fieldIndex: -1,
  });

  // Pseudo Code
  // State the itemForm.qty to the entered qty,
  // after that we what to check if there is estimated value
  // if estimated is true....we want to calculate it with the total of estimated price

  const handleDelete = function (index) {
    if (window.confirm("Are you sure you want to delete this item?")) {
      const updatedLists = [...lists];
      updatedLists[currentListIndex].items = updatedLists[
        currentListIndex
      ].items.filter((_, i) => i !== index);
      setLists(updatedLists);

      // setLists((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleCheck = (index) => {
    const updatedLists = [...lists];
    updatedLists[currentListIndex].items[index].completed =
      !updatedLists[currentListIndex].items[index].completed;

    setLists(updatedLists);

    // setLists((prev) =>
    //   prev.map((item, i) =>
    //     i === index ? { ...item, completed: !item.completed } : item
    //   )
    // );
  };

  const initNewListItem = (currentIdx) => {
    setShowForm(true);
    setCurrentListIndex(currentIdx);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    setItemForm((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "estimate" || name === "quantity") {
      const estimate =
        name === "estimate" ? parseFloat(value) : itemForm.estimate;
      const quantity =
        name === "quantity" ? parseInt(value) : itemForm.quantity;
      const totalEstimate = estimate * quantity;

      setItemForm((prev) => ({
        ...prev,
        quantity,
        estimate,
        totalEstimate,
      }));
    }
  };

  function handleSubmit(e) {
    e.preventDefault();

    if (!itemForm.name || !itemForm.quantity || !itemForm.estimate) {
      alert("Please input required fields");
    } else {
      // take the list
      // find the list with the current index
      // update the items in the list with the current Index.
      const updatedLists = [...lists];
      updatedLists[currentListIndex].items.push(itemForm);
      setLists(updatedLists);
    }

    setItemForm({
      name: "",
      quantity: 1,
      estimate: 0,
      totalEstimate: 0,
    });
  }

  const handleEdit = (i) => {
    setEdit(() => ({
      isSet: true,
      fieldIndex: i,
    }));

    console.log(edit.isSet, edit.fieldIndex);
  };

  const handleUpdate = (index, updatedItem) => {
    const updatedLists = [...lists];
    updatedLists[currentListIndex].items[index] = updatedItem;
    setLists(updatedLists);

    // setLists((prev) =>
    //   prev.map((item, i) => (i === index ? updatedItem : item))
    // );
  };
  const handleSave = (index, updatedItem) => {
    const updatedLists = [...lists];
    updatedLists[currentListIndex].items[index] = updatedItem;
    setLists(updatedLists);

    setEdit({ isSet: false, fieldIndex: -1 });

    // setLists((prev) =>
    //   prev.map((item, i) => (i === index ? updatedItem : item))
    // );
    // setEdit({ isSet: false, fieldIndex: -1 });
  };
  // const grandTotal =
  //   lists[currentListIndex]?.items.reduce((total, item) => {
  //     return item.completed ? total : total + Number(item.totalEstimate);
  //   }, 0) || 0;

  // const calculateListGrandTotal = (listIdx) => {
  //   const grandTotal = lists[listIdx]?.items.reduce((total, item) => {
  //     item.completed ? total : total + Number(item.totalEstimate);
  //   }, 0) || 0;
  //   return grandTotal;
  // };

  return (
    <>
      <h1>
        marketMate <img src={copyright} alt="copyright Image" />
      </h1>
      <button
        onClick={() => openListForm()}
        className={`imgContainer ${stopAnimation ? "stopAnimation" : ""}`}
      >
        <Icon
          className={`img ${stopAnimation ? "stopAnimation" : ""}`}
          icon="tabler:plus"
          width={24}
          height={24}
        />{" "}
        Create List
      </button>
      {showForm && (
        <form className="marketForm" onSubmit={(e) => handleSubmit(e)}>
          <input
            type="text"
            placeholder="Enter your item..."
            name="name"
            value={itemForm.name}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            type="number"
            placeholder="Estimated price"
            name="estimate"
            value={itemForm.estimate}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            type="number"
            placeholder="Quantity of item"
            name="quantity"
            value={itemForm.quantity}
            onChange={(e) => {
              handleChange(e);
            }}
          />
          <input
            type="number"
            placeholder="Total"
            name="totalEstimate"
            value={itemForm.totalEstimate}
            readOnly
          />
          <button type="submit">Add</button>
        </form>
      )}
      {lists && lists.length > 0 ? (
        lists.map((list, listIdx) => (
          <table key={listIdx} className="item-table">
            <caption
              style={{
                position: "relative",
                backgroundColor: "black",
                color: "#fff",
                fontStyle: "italic",
                textAlign: "center",
                fontWeight: "bold",
                padding: "10px",
                verticalAlign: "middle",
              }}
            >
              {" "}
              {list?.title || "No List Selected"}
              <div
                style={{
                  position: "absolute",
                  right: "10px",
                  top: "50%",
                  transform: "translateY(-50%)",
                }}
              >
                <button onClick={() => initNewListItem(listIdx)}>
                  <Icon icon="tabler:plus" width={24} />
                </button>
                <button>
                  <Icon icon="tabler:chevron-down" width={24} />
                </button>
                <button>
                  <Icon icon="tabler:edit" width={24} />
                </button>
                <button>
                  <Icon icon="tabler:trash" width={24} />
                </button>
              </div>
            </caption>
            <thead>
              <tr>
                <th>Item</th>
                <th>Quantity</th>
                <th>Estimated Price</th>
                <th>Total</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.items.map((listItem, listItemIdx) => (
                <tr
                  key={listItemIdx}
                  className={listItem.completed ? "completed" : ""}
                >
                  <td style={{ fontWeight: "bold", fontStyle: "italic" }}>
                    {edit.isSet && edit.fieldIndex === listItemIdx ? (
                      <input
                        name="name"
                        value={listItem.name}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const updatedItem = { ...listItem, [name]: value };
                          handleUpdate(listItemIdx, updatedItem);
                        }}
                      />
                    ) : (
                      listItem.name
                    )}
                  </td>
                  <td>
                    {edit.isSet && edit.fieldIndex === listItemIdx ? (
                      <input
                        name="quantity"
                        value={listItem.quantity}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const updatedItem = { ...listItem, [name]: value };
                          handleUpdate(listItemIdx, updatedItem);
                        }}
                      />
                    ) : (
                      listItem.quantity
                    )}
                  </td>
                  <td>
                    {edit.isSet && edit.fieldIndex === listItemIdx ? (
                      <input
                        name="estimate"
                        value={listItem.estimate}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const updatedItem = { ...listItem, [name]: value };
                          handleUpdate(listItemIdx, updatedItem);
                        }}
                      />
                    ) : (
                      listItem.estimate
                    )}
                  </td>
                  <td>
                    {edit.isSet && edit.fieldIndex === listItemIdx ? (
                      <input
                        name="totalEstimate"
                        value={listItem.totalEstimate}
                        onChange={(e) => {
                          const { name, value } = e.target;
                          const updatedItem = { ...listItem, [name]: value };
                          handleUpdate(listItemIdx, updatedItem);
                        }}
                      />
                    ) : (
                      listItem.totalEstimate
                    )}
                  </td>
                  <td>
                    {edit.isSet && edit.fieldIndex === listItemIdx ? (
                      <button
                        onClick={() => {
                          handleSave(listItemIdx, listItem);
                        }}
                      >
                        Update
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          handleEdit(listItemIdx);
                        }}
                      >
                        <img src={eddit} alt="editButton" className="edit" />
                      </button>
                    )}
                    <button
                      onClick={() => {
                        handleCheck(listItemIdx);
                      }}
                    >
                      {" "}
                      <img
                        src={check}
                        alt="checkButton"
                        className="check"
                      />{" "}
                    </button>
                    <button
                      onClick={() => {
                        handleDelete(listItemIdx);
                      }}
                    >
                      {" "}
                      <img src={remove} alt="removeButton" className="remove" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan={3}>
                  <strong>Grand Total</strong>
                </td>
                <td colSpan={1}>
                  <span style={{ fontWeight: "900", fontFamily: "Arial" }}>
                    #
                  </span>
                  {list.items.reduce(
                    (total, item) =>
                      item.completed
                        ? total
                        : total + Number(item.totalEstimate),
                    0
                  ) || 0}
                </td>
              </tr>
            </tfoot>
          </table>
        ))
      ) : (
        <p>No Data available. Starting adding your list</p>
      )}
      {/* <Form /> */}
    </>
  );
}
