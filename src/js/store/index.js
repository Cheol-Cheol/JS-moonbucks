// 상태관리를 위한 객체
const store = {
  setLocalStorage(menu) {
    localStorage.setItem("menu", JSON.stringify(menu));
    //LocalStorage에는 문자열로만 저장되어야한다. - JSON.stringify()
  },
  getLocalStorage() {
    return JSON.parse(localStorage.getItem("menu"));
  },
};

export default store;
