import { SearchIcon } from "@/assets/icons/search";
import styles from "./HomePage.module.css";
import { EditIcon, MoonIcon, PlusIcon, SunIcon, TrashIcon } from "@/assets/icons";
import { useEffect, useRef, useState } from "react";
import { Modal } from "@/components/modal";
import { motion, AnimatePresence } from "framer-motion";
import { useTheme } from "@/components/useTheme";

export const HomePage = () => {
  const [data, setData] = useState<{ task: string; status: string }[]>([]);
  const [task, setTask] = useState("");
  const [modal, setModal] = useState(false);
  const [modalType, setModalType] = useState<"add" | "edit" | "delete" | null>(null);
  const [currentEditIndex, setCurrentEditIndex] = useState<number | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const isFirstRender = useRef(true);
  const { darkMode, toggleTheme } = useTheme();

  const openModal = (type: "add" | "edit" | "delete", index?: number) => {
    setCurrentEditIndex(index !== undefined ? index : null);
    setModal(true);
    setModalType(type);
  };

  const handleSubmit = () => {
    switch (modalType) {
      case "add":
        if (task.trim() === "") return;

        setData((prev) => [
          ...prev,
          {
            task,
            status: "incomplete",
          },
        ]);
        setModal(false);
        setTask("");
        break;
      case "edit":
        setData((prev) => prev.map((item, idx) => (idx === currentEditIndex ? { ...item, task } : item)));
        setTask("");
        setModal(false);
        break;
      case "delete":
        setData((prev) => prev.filter((_, i) => i !== currentEditIndex));
        setModal(false);
        break;
    }
  };

  const filteredData = data
    .map((item, i) => ({ ...item, dataIndex: i }))
    .filter((item) => {
      const filterData = filter === "all" ? true : item.status === filter;
      const filterSearch = item.task.toLowerCase().includes(search.toLowerCase());
      return filterData && filterSearch;
    });

  useEffect(() => {
    const savedData = localStorage.getItem("todos");
    if (savedData) {
      setData(JSON.parse(savedData));
    }
  }, []);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }
    localStorage.setItem("todos", JSON.stringify(data));
  }, [data]);

  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <>
      <div className={styles.layout}>
        <h2 className={styles.title}>TODO LIST</h2>

        <div className={styles.content_top}>
          <label htmlFor="search" className={styles.search}>
            <input type="text" id="search" placeholder="Search note..." onChange={(e) => setSearch(e.target.value)} />
            <SearchIcon />
          </label>
          <select className={styles.filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="all">All</option>
            <option value="complete">Complete</option>
            <option value="incomplete">Incomplete</option>
          </select>
          <div className={styles.theme} onClick={toggleTheme}>
            <div className={`${styles.theme_item} ${darkMode && styles.active}`}>
              <MoonIcon />
            </div>
            <div className={`${styles.theme_item} ${!darkMode && styles.active}`}>
              <SunIcon />
            </div>
          </div>
        </div>

        <div className={styles.content}>
          <AnimatePresence>
            {filteredData.length > 0 ? (
              filteredData.map((e: any) => (
                <motion.div
                  layout
                  key={e.dataIndex}
                  className={styles.content_item}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className={`${styles.content_item_left} ${e.status === "complete" && styles.inactive}`}>
                    <input
                      checked={e.status === "complete"}
                      type="checkbox"
                      onChange={() =>
                        setData((prev) =>
                          prev.map((item, i) =>
                            i === e.dataIndex
                              ? { ...item, status: item.status === "complete" ? "incomplete" : "complete" }
                              : item
                          )
                        )
                      }
                    />
                    {e.task}
                  </div>
                  <div className={styles.content_item_actions}>
                    <div className={styles.content_item_btn} onClick={() => openModal("edit", e.dataIndex)}>
                      <EditIcon />
                    </div>
                    <div className={styles.content_item_btn} onClick={() => openModal("delete", e.dataIndex)}>
                      <TrashIcon />
                    </div>
                  </div>
                </motion.div>
              ))
            ) : (
              <motion.div
                key="empty"
                className={styles.empty}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.3 }}
              >
                {darkMode ? (
                  <img src="/src/assets/images/empty_dark.svg" alt="" />
                ) : (
                  <img src="/src/assets/images/empty.svg" alt="" />
                )}
                <p>Empty...</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        <div className={styles.add} onClick={() => openModal("add")}>
          <PlusIcon />
        </div>
      </div>

      <Modal
        isOpen={modal}
        onClose={() => setModal(false)}
        title={modalType === "add" ? "New Note" : modalType === "edit" ? "Edit Note" : "Delete Note?"}
        onSubmit={handleSubmit}
      >
        {modalType !== "delete" ? (
          <input
            type="text"
            value={task}
            className={styles.modal_input}
            onChange={(e: any) => setTask(e.target.value)}
            placeholder="Input your note..."
          />
        ) : (
          ""
        )}
      </Modal>
    </>
  );
};
