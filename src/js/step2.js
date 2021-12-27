// step2 요구사항 - 상태 관리로 메뉴 관리하기

// TODO localStorage Read & Write
// - [x] localStorage에 데이터를 저장한다.
//  -[x] 메뉴를 추가할 때
//  -[x] 메뉴를 수정할 때
//  -[x] 메뉴를 삭제할 때
// - [x] localStorage에 있는 데이터를 읽어온다.

// TODO 카테고리별 메뉴판 관리
// - [x] 에스프레소 메뉴판 관리
// - [x] 프라푸치노 메뉴판 관리
// - [x] 블렌디드 메뉴판 관리
// - [x] 티바나 메뉴판 관리
// - [x] 디저트 메뉴판 관리

// TODO 페이지 접근시 최초 데이터 Read & Rendering
// - [x] 페이지에 최초로 로딩될 때 localStorage에 에스프레소 메뉴를 읽어온다.
// - [x] 에스프레소 메뉴를 페이지에 그려준다.

// TODO 품절 상태 관리
// - [x] 품절 버튼을 추가한다.
// - [x] 품절 버튼을 클릭하면 localStorage에 상태값이 저장된다.
// - [x] 품절 해당메뉴의 상태값이 페이지에 그려진다.
// - [x] 클릭 이벤트에서 가장 가까운 li 태그의 class 속성 값에 sold-out을 추가한다.

// 중복된 코드들을 줄이기 위해 일종의 util를 사용한다.
// HTML element를 가져올 때 '$'을 관용적으로 사용한다.
const $ = (selector) => document.querySelector(selector);

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
  };

  // 재사용 함수
  const render = () => {
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
    const menuCount = $("#menu-list").querySelectorAll("li").length;
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
    // 2. this.menu를 LocalStorage에도 저장하기
    store.setLocalStorage(this.menu);
    // map를 통해 this.menu의 메뉴들 각각 마크업 시키기
    render();
    $("#menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    this.menu[this.currentCategory][menuId].name = updatedMenuName;
    store.setLocalStorage(this.menu);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      const menuId = e.target.closest("li").dataset.menuId;
      this.menu[this.currentCategory].splice(menuId, 1);
      store.setLocalStorage(this.menu);
      e.target.closest("li").remove();
      // .remove() : DOM element를 삭제해주는 메소드
      updateMenuCount();
    }
  };

  const soldOutMenu = (e) => {
    const menuId = e.target.closest("li").dataset.menuId;
    this.menu[this.currentCategory][menuId].soldOut =
      !this.menu[this.currentCategory][menuId].soldOut;
    store.setLocalStorage(this.menu);
    render();
  };

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
    const isCategoryButton = e.target.classList.contains("cafe-category-name");
    if (isCategoryButton) {
      const categoryName = e.target.dataset.categoryName;
      this.currentCategory = categoryName;
      $("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
      render();
    }
  });
}

const app = new App();
app.init();
