import { $ } from "./utils/dom.js";
import store from "./store/index.js";

function App() {
  // 상태(변하는 데이터) - 메뉴명
  this.menu = {
    espresso: [],
    frappuccino: [],
    blended: [],
    teavana: [],
    desert: [],
  };

  this.currentCategory = "espresso";

  this.init = () => {
    if (store.getLocalStorage()) {
      this.menu = store.getLocalStorage();
    }
    render();
    initEventListeners();
  };

  // 재사용 함수
  const render = () => {
    // map를 통해 this.menu의 메뉴들 각각 마크업 시키기
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        // data- : 어떤 data를 저장하고 싶을 때 사용하는 표준 속성
        return `<li data-menu-id="${index}" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${item.soldOut ? "sold-out" : ""}">${
          item.name
        }</span>
      <button
      type="button"
      class="bg-gray-50 text-gray-500 text-sm mr-1 menu-sold-out-button"
      >
        품절
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm mr-1 menu-edit-button"
      >
        수정
      </button>
      <button
        type="button"
        class="bg-gray-50 text-gray-500 text-sm menu-remove-button"
      >
        삭제
      </button>
    </li>`;
      })
      .join("");
    // template => ['<li>~</li>','<li>~</li>...'] 이런 배열 형태
    // 하나의 마크업으로 만들기 위해 문자열로 바꿔야한다. .join("") 추가해서 해결
    // '<li>~</li><li>~</li>...' 문자열 형태로 변경
    $("#menu-list").innerHTML = template;
    updateMenuCount();
  };

  const updateMenuCount = () => {
    const menuCount = this.menu[this.currentCategory].length;
    // 변수명은 클래스명이나 요소의 힌트들을 사용해서 작명하자.
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const menuName = $("#menu-name").value;
    // 1. this.menu(상태)에 메뉴들 추가하기
    this.menu[this.currentCategory].push({ name: menuName });
    // push()안에 인자를 객체로 준다. why?) 여러개의 데이터를 속성을 통해 불러오기 위해
    // 2. this.menu를 LocalStorage에도 저장하기
    store.setLocalStorage(this.menu);

    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

  const initEventListeners = () => {
    // 이벤트 함수들
    // 이벤트 위임 - e.target
    $("#menu-list").addEventListener("click", (e) => {
      // if 문이 여러 개 일 때 만약 첫번째 if를 돌면 나머지 if문은 돌 필요가 없기 때문에 return을 작성해주는 습관이 좋다.
      if (e.target.classList.contains("menu-edit-button")) {
        // classList.contains() & .closest()
        updateMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-remove-button")) {
        removeMenuName(e);
        return;
      }

      if (e.target.classList.contains("menu-sold-out-button")) {
        soldOutMenu(e);
        return;
      }
    });

    // form태그가 자동으로 전송되는 것을 막아준다.
    $("#menu-form").addEventListener("submit", (e) => {
      e.preventDefault();
    });

    $("#menu-submit-button").addEventListener("click", addMenuName);

    // 메뉴의 이름을 입력받는건
    $("#menu-name").addEventListener("keypress", (e) => {
      if (e.key !== "Enter") {
        return;
      }
      addMenuName();
    });

    $("nav").addEventListener("click", (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        render();
      }
    });
  };
}

const app = new App();
app.init();
