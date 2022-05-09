/*

- [x] 저장소에 데이터를 저장한다. 
  - [x] 메뉴를 추가할 때
  - [x] 메뉴를 수정할 때
  - [x] 메뉴를 삭제할 때
- [x] 저장소에서 데이터를 읽어온다.

- [x] 프라푸치노 메뉴판을 관리할 수 있게 만든다.
- [x] 블렌디드 메뉴판을 관리할 수 있게 만든다.
- [x] 티바나 메뉴판을 관리할 수 있게 만든다.
- [x] 디저트 메뉴판을 관리할 수 있게 만든다.

- [x] 새로고침 할 때 에스프레소 데이터를 읽어온다. 
- [x] 페이지에 최초로 접근할 때는 에스프레소 메뉴를 화면에 렌더링 해준다.


- [] 리스트에 품절버튼을 추가한다. 
- [] 품절 버튼의 Toggle 상태에 따라서 localStorage에 저장하거나 제거한다.  
- [] 품절 버튼의 Toggle 상태에 따라서 'sold-out' 클래스를 제거하거나 추가한다. 
- [] 클래스 여부에 따라 상태가 변경된다. 

*/

const $ = (selector) => document.querySelector(selector);

const store = {
	setLocalStorage(menu) {
		localStorage.setItem("menu", JSON.stringify(menu));
	},
	getLocalStorage() {
		return JSON.parse(localStorage.getItem("menu"));
	},
};

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
	this.init = () => {
		if (store.getLocalStorage()) {
			this.menu = store.getLocalStorage();
			render();
		}
	};

	// 렌더링 해주는 함수
	const render = () => {
		const template = this.menu[this.currentCategory]
			.map((menu, index) => {
				return `<li data-menu-id=${index} class="menu-list-item d-flex items-center py-2">
        <span class="w-100 pl-2 menu-name">${menu.name}</span>
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

		$("#espresso-menu-list").innerHTML = template;
	};

	// form 태그가 자동으로 전송되는것을 막아준다.
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	const updatedCount = () => {
		const items = document.querySelectorAll(".menu-list-item");
		$(".menu-count").innerHTML = `총 ${items.length}개`;
	};

	const addMenu = (e) => {
		if ($("#espresso-menu-name").value === "") {
			alert("메뉴를 입력해주세요!");
			return;
		}

		const menuName = $("#espresso-menu-name").value;

		// 상태에 추가
		this.menu[this.currentCategory].push({ name: menuName });

		// 로컬에 저장
		store.setLocalStorage(this.menu);

		render();

		// count 업데이트
		updatedCount();

		// 빈칸 초기화
		$("#espresso-menu-name").value = "";
	};

	const removeMenu = (e) => {
		if (e.target.classList.contains("menu-remove-button")) {
			if (confirm("정말 삭제하시겠습니까?")) {
				e.target.closest("li").remove();
				updatedCount();

				const menuId = e.target.closest("li").dataset.menuId;
				this.menu[this.currentCategory].splice(menuId, 1);
				store.setLocalStorage(this.menu);
			}
		}
	};

	const updateMenu = (e) => {
		const $menuName = e.target.closest("li").querySelector(".menu-name");
		const updatedMenu = prompt("메뉴명을 수정하세요!", $menuName.innerText);
		$menuName.innerText = updatedMenu;

		const menuId = e.target.closest("li").dataset.menuId;

		this.menu[this.currentCategory][menuId].name = updatedMenu;
		store.setLocalStorage(this.menu);
	};

	// 메뉴 추가 - 확인 버튼
	$("#espresso-menu-submit-button").addEventListener("click", (e) => {
		addMenu();
	});

	// 메뉴 추가 - 엔터키
	$("#espresso-menu-name").addEventListener("keypress", (e) => {
		if (e.key !== "Enter") return;
		addMenu(e);
	});

	// --- 메뉴 수정 ---

	$("#espresso-menu-list").addEventListener("click", (e) => {
		if (e.target.classList.contains("menu-edit-button")) {
			updateMenu(e);
		}
	});

	// --- 메뉴 삭제 ---

	$("#espresso-menu-list").addEventListener("click", (e) => {
		removeMenu(e);
	});

	// ---- 메뉴판 선택 ----

	// => 각 메뉴판에 리스터를 달지 말고 상위 부모 nav에 리스너를 달아준다.
	$("nav").addEventListener("click", (e) => {
		const isCategoryName = e.target.classList.contains("cafe-category-name");
		if (isCategoryName) {
			this.currentCategory = e.target.dataset.categoryName;
			render();
			$("#category-title").innerText = `${e.target.innerText} 메뉴 관리`;
		}
	});
}

const app = new App();
app.init();
