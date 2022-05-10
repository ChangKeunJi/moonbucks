/*

// TODO 서버
- [ ] 웹 서버를 띄워서 서버를 가동한다. 
- [ ] 카테고리별 메뉴 리스트를 불러온다. 
- [ ] 서버에 새로운 메뉴를 추가할 수 있도록 요청한다. 
- [ ] 서버에 메뉴를 수정할 수 있도록 요청한다. 
- [ ] 서버에 메뉴를 삭제할 수 있도록 요청한다. 
- [ ] 서버에 품절 상태를 토글할 수 있도록 요청한다. 

// TODO 리팩토링
- [ ] localStorage에 저장하는 로직은 지운다.
- [ ] fetch 비동기 api를 사용하는 부분을 async await을 사용하여 구현한다.

// TODO 사용자 경험
- [ ] API 통신이 실패하는 경우에 대해 사용자가 알 수 있게 [alert]으로 예외처리를 진행한다.
- [ ] 중복되는 메뉴는 추가할 수 없다.

*/

import { $ } from "./utils/dom.js";
import { store } from "./store/index.js";
import menuApi from "./api/index.js";

function App() {
	this.menu = {
		espresso: [],
		frappuccino: [],
		blended: [],
		teavana: [],
		desert: [],
	};

	this.currentCategory = "espresso";

	// 인스턴스 생성될 때 초기화 하는 함수
	this.init = async () => {
		initEvent();
		this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
			this.currentCategory
		);
		render();
	};

	// 렌더링 해주는 함수
	const render = async () => {
		this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
			this.currentCategory
		);

		const template = this.menu[this.currentCategory]
			.map((menu, index) => {
				return `<li data-menu-id=${
					menu.id
				} class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name ${
					menu.isSoldOut ? "sold-out" : ""
				}">${menu.name}</span>
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

		$("#menu-list").innerHTML = template;
		updateCount();
	};

	// 엔터를 눌렀을 때 form 태그가 자동으로 전송되는것을 막아준다.
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	const updateCount = () => {
		$(".menu-count").innerHTML = `총 ${
			this.menu[this.currentCategory].length
		}개`;
	};

	const addMenu = async (e) => {
		if ($("#menu-name").value === "") {
			alert("메뉴를 입력해주세요!");
			return;
		}

		const menuName = $("#menu-name").value;

		await menuApi.addMenu(this.currentCategory, menuName);

		render();

		// 빈칸 초기화
		$("#menu-name").value = "";
	};

	const removeMenu = async (e) => {
		if (e.target.classList.contains("menu-remove-button")) {
			if (confirm("정말 삭제하시겠습니까?")) {
				const menuId = e.target.closest("li").dataset.menuId;
				await menuApi.deleteMenu(this.currentCategory, menuId);
				render();
			}
		}
	};

	const updateMenu = async (e) => {
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenu = prompt("메뉴명을 수정하세요!", $menuName.innerText);

		const menuId = e.target.closest("li").dataset.menuId;

		await menuApi.updateMenu(this.currentCategory, menuId, updatedMenu);

		render();
	};

	const makeSoldout = async (e) => {
		if (e.target.classList.contains("menu-sold-out-button")) {
			const id = e.target.closest("li").dataset.menuId;

			await menuApi.toggleSoldout(this.currentCategory, id);

			render();
		}
	};

	const initEvent = () => {
		// 메뉴 추가 - 확인 버튼
		$("#espresso-menu-submit-button").addEventListener("click", (e) => {
			addMenu();
		});

		// 메뉴 추가 - 엔터키
		$("#menu-name").addEventListener("keypress", (e) => {
			if (e.key !== "Enter") return;
			addMenu(e);
		});

		// --- 메뉴 수정 ---

		$("#menu-list").addEventListener("click", (e) => {
			if (e.target.classList.contains("menu-edit-button")) {
				updateMenu(e);
			}
		});

		// --- 메뉴 삭제 ---

		$("#menu-list").addEventListener("click", (e) => {
			removeMenu(e);
		});

		// --- 품절 표시 ---
		$("#menu-list").addEventListener("click", (e) => {
			makeSoldout(e);
		});

		// ---- 메뉴판 선택 ---- => 각 메뉴판에 리스터를 달지 말고 상위 부모 nav에 리스너를 달아준다.
		$("nav").addEventListener("click", async (e) => {
			const isCategoryName = e.target.classList.contains("cafe-category-name");
			if (isCategoryName) {
				this.currentCategory = e.target.dataset.categoryName;
				this.menu[this.currentCategory] = await menuApi.getAllMenuByCategory(
					this.currentCategory
				);
				render();
				$("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
			}
		});
	};
}

const app = new App();
app.init();
