// TODO 서버 요청 부분
// - [x] 웹 서버를 띄운다.
// - [x] 서버에 새로운 메뉴명을 추가될 수 있도록 요청한다.
// - [x] 서버에 카테고리별 메뉴리스트를 불러오도록 요청한다.
// - [x] 서버에 메뉴가 수정될 수 있도록 요청한다.
// - [x] 서버에 메뉴의 품절상태가 토글될 수 있도록 요청한다.
// - [] 서버에 메뉴가 삭제될 수 있도록 요청한다.

// TODO 리팩토링 부분
// - [] localStorage에 저장하는 로직은 지운다.
// - [] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
// - [] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 alert으로 예외처리를 진행한다.
// - [] 중복되는 메뉴는 추가할 수 없다.

import { $ } from "./utils/dom.js";
import store from "./store/index.js";

const BASE_URL = "http://localhost:3000/api";

const MenuApi = {
  async getAllMenuByCategory(category) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`);
    return response.json();
  },

  async createMenu(category, name) {
    const response = await fetch(`${BASE_URL}/category/${category}/menu`, {
      method: "POST",
      // POST - 생성
      headers: {
        "Content-Type": "application/json",
        // 데이터를 주고 받는 형태 - 여기선 json
      },
      body: JSON.stringify({ name }),
      // 추가된 메뉴
    });
    if (!response.ok) {
      console.error("에러가 발생발생!");
    }
  },

  async updateMenu(category, name, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          // 데이터를 주고 받는 형태 - 여기선 json
        },
        body: JSON.stringify({ name }),
      }
    );
    if (!response.ok) {
      console.error("에러가 발생발생!");
    }
    return response.json();
  },

  async toggleSoldOutMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}/soldout`,
      {
        method: "PUT",
      }
    );
    if (!response.ok) {
      console.log("에러가 발생발생!");
    }
  },

  async deleteMenu(category, menuId) {
    const response = await fetch(
      `${BASE_URL}/category/${category}/menu/${menuId}`,
      {
        method: "DELETE",
      }
    );
  },
};

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

  this.init = async () => {
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    initEventListeners();
  };

  const render = () => {
    // map를 통해 this.menu의 메뉴들 각각 마크업 시키기
    const template = this.menu[this.currentCategory]
      .map((item, index) => {
        // data- : 어떤 data를 저장하고 싶을 때 사용하는 표준 속성
        return `<li data-menu-id="${
          item.id
        }" class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name ${item.isSoldOut ? "sold-out" : ""}">${
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

  const addMenuName = async () => {
    if ($("#menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const menuName = $("#menu-name").value;
    await MenuApi.createMenu(this.currentCategory, menuName);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    await MenuApi.updateMenu(this.currentCategory, updatedMenuName, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    // this.menu[this.currentCategory][menuId].name = updatedMenuName;
    // store.setLocalStorage(this.menu);
    render();
  };

  const removeMenuName = async (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      await MenuApi.deleteMenu(this.currentCategory, menuId);
      this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
        this.currentCategory
      );
      //   this.menu[this.currentCategory].splice(menuId, 1);
      //   store.setLocalStorage(this.menu);
      render();
    }
  };

  const soldOutMenu = async (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    await MenuApi.toggleSoldOutMenu(this.currentCategory, menuId);
    this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
      this.currentCategory
    );
    // this.menu[this.currentCategory][menuId].soldOut =
    //   !this.menu[this.currentCategory][menuId].soldOut;
    // store.setLocalStorage(this.menu);
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

    $("nav").addEventListener("click", async (e) => {
      const isCategoryButton =
        e.target.classList.contains("cafe-category-name");
      if (isCategoryButton) {
        const categoryName = e.target.dataset.categoryName;
        this.currentCategory = categoryName;
        $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
        this.menu[this.currentCategory] = await MenuApi.getAllMenuByCategory(
          this.currentCategory
        );
        render();
      }
    });
  };
}

const app = new App();
app.init();
