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

export default MenuApi;
