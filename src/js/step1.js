// step1 요구사항 구현을 위한 전략

// TODO 메뉴 추가
// - [x] 메뉴의 이름을 입력 받고 엔터키를 누르면 메뉴가 추가된다.
// - [x] 메뉴의 이름을 입력 받고 확인 버튼을 클릭하면 메뉴가 추가된다.
// - [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.
// - [x] 메뉴가 추가되면, input은 빈 값으로 초기화한다.
// - [x] 사용자 입력값이 빈 값이라면 추가되지 않는다.

// TODO 메뉴 수정
// - [x] 메뉴의 수정 버튼을 눌러 메뉴 이름을 업데이트한다.
// - [x] 메뉴 수정시 브라우저에서 제공하는 prompt 인터페이스를 활용한다.

// TODO 메뉴 삭제
// - [x] 메뉴 삭제 버튼을 이용하여 메뉴 삭제 confirm 인터페이스를 활용한다.
// - [x] 확인 버튼을 클릭하면 메뉴가 삭제된다.
// - [x] 총 메뉴 갯수를 count하여 상단에 보여준다.

// 중복된 코드들을 줄이기 위해 일종의 util를 사용한다.
// HTML element를 가져올 때 '$'을 관용적으로 사용한다.
const $ = (selector) => document.querySelector(selector);

function App() {
  // 재사용 함수
  const updateMenuCount = () => {
    const menuCount = $("#espresso-menu-list").querySelectorAll("li").length;
    // 변수명은 클래스명이나 요소의 힌트들을 사용해서 작명하자.
    $(".menu-count").innerText = `총 ${menuCount}개`;
  };

  const addMenuName = () => {
    if ($("#espresso-menu-name").value === "") {
      alert("값을 입력해주세요");
      return;
    }
    const espressoMenuName = $("#espresso-menu-name").value;
    const menuItemTemplate = (espressoMenuName) => {
      return `<li class="menu-list-item d-flex items-center py-2">
      <span class="w-100 pl-2 menu-name">${espressoMenuName}</span>
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
    };
    // $("#espresso-menu-list").innerHTML = menuItemTemplate(espressoMenuName);
    // 해당 코드로 작성 시 1. 아메리카노 추가 2. 카페라떼 추가 할 때 카페라떼만 덮어써지는 문제가 발생한다.
    // 직관적인 해결법 : Element.insertAdjacentHTML()을 사용하자
    $("#espresso-menu-list").insertAdjacentHTML(
      "beforeend",
      menuItemTemplate(espressoMenuName)
    );
    updateMenuCount();
    $("#espresso-menu-name").value = "";
  };

  const updateMenuName = (e) => {
    const $menuName = e.target.closest("li").querySelector(".menu-name");
    const updatedMenuName = prompt("메뉴명을 수정하세요", $menuName.innerText);
    $menuName.innerText = updatedMenuName;
  };

  const removeMenuName = (e) => {
    if (confirm("정말 삭제하시겠습니까?")) {
      e.target.closest("li").remove();
      // .remove() : DOM element를 삭제해주는 메소드
      updateMenuCount();
    }
  };

  // 이벤트 함수들
  // 이벤트 위임 - e.target
  $("#espresso-menu-list").addEventListener("click", (e) => {
    if (e.target.classList.contains("menu-edit-button")) {
      // classList.contains() & .closest()
      updateMenuName(e);
    }

    if (e.target.classList.contains("menu-remove-button")) {
      removeMenuName(e);
    }
  });

  // form태그가 자동으로 전송되는 것을 막아준다.
  $("#espresso-menu-form").addEventListener("submit", (e) => {
    e.preventDefault();
  });

  $("#espresso-menu-submit-button").addEventListener("click", addMenuName);

  // 메뉴의 이름을 입력받는건
  $("#espresso-menu-name").addEventListener("keypress", (e) => {
    if (e.key !== "Enter") {
      return;
    }
    addMenuName();
  });
}

App();
