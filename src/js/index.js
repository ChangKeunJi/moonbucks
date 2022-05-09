// step1 요구사항 구현을 위한 전략
/*
< 메뉴 추가 >

- [x] 엔터키를 누르면 새로운 메뉴를 추가한다. 
- [x] 확인 버튼 클릭 새로운 메뉴를 추가한다. 
- [x] 확인 버튼 또는 엔터키를 누른뒤 input이 값을 가지고 있다면 input 값을 초기화한다. 
- [x] 총 메뉴 갯수를 상단에 표시한다. 
- [x] 추가되는 메뉴의 아래 마크업은 <ul id="espresso-menu-list" class="mt-3 pl-0"></ul> 안에 삽입해야 한다.

< 메뉴 수정 >

- [x] 수정 버튼을 누르면 메뉴 이름을 수정할 수 있다. 
- [x] prompt 인터페이스를 이용해 메뉴를 수정한다. 

< 메뉴 삭제 >

- [] 삭제 버튼을 누르면 메뉴를 삭제한다. 
- [] confirm 인터페이스를 이용해 메뉴를 삭제한다. 
*/

const $ = (selector) => document.querySelector(selector);

function App() {
	// form 태그가 자동으로 전송되는것을 막아준다.
	$("#espresso-menu-form").addEventListener("submit", (e) => {
		e.preventDefault();
	});

	// -- helper / count 업데이트

	const updatedCount = () => {
		const items = document.querySelectorAll(".menu-list-item");
		$(".menu-count").innerHTML = `총 ${items.length}개`;
	};

	// -- helper / 메뉴추가

	const addMenu = (e) => {
		if ($("#espresso-menu-name").value === "") {
			alert("메뉴를 입력해주세요!");
			return;
		}

		const menuName = $("#espresso-menu-name").value;

		const menuTemplate = (menuName) => {
			return `		<li class="menu-list-item d-flex items-center py-2">
					<span class="w-100 pl-2 menu-name">${menuName}</span>
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

		$("#espresso-menu-list").insertAdjacentHTML(
			"beforeEnd",
			menuTemplate(menuName)
		);

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
			}
		}
	};

	const updateMenu = (e) => {
		if (e.target.classList.contains("menu-edit-button")) {
			const $menuName = e.target.closest("li").querySelector(".menu-name");
			const updatedMenu = prompt("메뉴명을 수정하세요!", $menuName.innerText);
			$menuName.innerText = updatedMenu;
		}
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
		updateMenu(e);
	});

	// --- 메뉴 삭제 ---

	$("#espresso-menu-list").addEventListener("click", (e) => {
		removeMenu(e);
	});
}

App();
