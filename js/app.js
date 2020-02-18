const addLink = document.querySelector('#add-link');
const modalBg = document.querySelector('.modal-bg');
const modalClose = document.querySelector('.modal-close');
const titleInput = document.querySelector('#title');
const despInput = document.querySelector('#description');
const linkInput = document.querySelector('#link');
const category = document.querySelector('#category');
const addLinkForm = document.querySelector('.modal__form');
const cardWrap = document.querySelector('.card-wrap');
const addCategory = document.querySelector('#filter__plus');
const removeCategory = document.querySelector('#filter__minus');
const closeCatModal = document.querySelector('.modal-cat-close');
const modalCatBg = document.querySelector('.modal-cat-bg');
const closeCatRemoveModal = document.querySelector('.modal-cat-remove-close');
const modalCatRemoveBg = document.querySelector('.modal-cat-remove-bg');
const modalAddCatForm = document.querySelector('.modal-cat-form');
const modalRemoveCatForm = document.querySelector('.modal-cat-remove-form');
const filterBtnWrap = document.querySelector('.filter__btnWrap');
const linkCategoryDropdown = document.querySelector('#category');
const searchEl = document.querySelector('#search');
const modalBgEdit = document.querySelector('.modal-bg-edit');

let linksData = [
  {
    title: 'JS for NOOB',
    description: 'MDN documentation',
    link: 'https://www.google.com/',
    linkCategory: 'Javascript'
  },
  {
    title: 'UI/UX for NOOB',
    description: 'Dribble post',
    link: 'https://www.dribbble.com',
    linkCategory: 'Design'
  },
  {
    title: 'why universe exists?',
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'Knowledge'
  },
  {
    title: 'Why Javascript?',
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'Javascript'
  },
  {
    title: "What we can do with Javascript? Let's Explore",
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'Javascript'
  },
  {
    title: 'Human Being',
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'Knowledge'
  },
  {
    title: 'Learn Programming?',
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'Programming'
  },
  {
    title: 'Artificial Intelligence',
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'Programming'
  },
  {
    title: 'Flex and Grid',
    description: 'medium post',
    link: 'https://www.medium.com',
    linkCategory: 'CSS'
  }
];
let categoryData = [
  'All',
  'Design',
  'Programming',
  'CSS',
  'Javascript',
  'Knowledge'
];

// Handle modal open and close
addLink.addEventListener('click', e => {
  modalBg.classList.add('modal-bg-active');
});

modalClose.addEventListener('click', e => {
  modalBg.classList.remove('modal-bg-active');
});

// Handle add Link process
addLinkForm.addEventListener('submit', e => {
  e.preventDefault();
  let title = e.target.elements.title.value;
  let description = e.target.elements.description.value;
  let link = e.target.elements.link.value;
  let linkCategory = category.options[category.selectedIndex].value;
  const id = uuid();
  const markUp = `
      <div class="card" data-link="${id}">
        <div class="card__top">
          <span>Share</span>
          <span>Fav</span>
        </div>

        <div class="card__content">
          <div class="card__title">
            <a href="${link}" target="_blank">${title}</a>
          </div>
          <div class="card__description">
            <p>
              ${description.length === 0 ? '---' : description}
            </p>
          </div>
        </div>

        <div class="card__bottom">
          <i class="far fa-edit" id="edit-card"></i>
          <i class="far fa-trash-alt" id="delete-card"></i>
        </div>
      </div>
    </div>
  `;

  // Check inputs to push data int linksData
  if (title.length > 0 && link.length > 0) {
    linksData.push({
      id,
      title,
      description,
      link,
      linkCategory
    });
    e.target.elements.title.value = '';
    e.target.elements.description.value = '';
    e.target.elements.link.value = '';
    modalBg.classList.remove('modal-bg-active');

    cardWrap.insertAdjacentHTML('afterbegin', markUp);
    console.log('before deleting', linksData);

    cardWrap.innerHTML = '';
    renderLinkDataCard(linksData);
  }
});

// Handle modal OPEN and CLOSE for category
closeCatModal.addEventListener('click', e => {
  modalCatBg.classList.remove('modal-cat-bg-active');
});
addCategory.addEventListener('click', e => {
  modalCatBg.classList.add('modal-cat-bg-active');
});

closeCatRemoveModal.addEventListener('click', e => {
  modalCatRemoveBg.classList.remove('modal-cat-remove-bg-active');
});
removeCategory.addEventListener('click', e => {
  modalCatRemoveBg.classList.add('modal-cat-remove-bg-active');
});

// Handle ADD category and REMOVE category
modalAddCatForm.addEventListener('submit', e => {
  e.preventDefault();
  const category = e.target.elements.addCategory.value;
  categoryData.push(category);
  // to inject category data to the UI (dropdown list)
  linkCategoryDropdown.innerHTML = '';
  injectCategory(categoryData);

  const markUp = `
    <button class="categoryBtn">${category}</button>
  `;
  filterBtnWrap.insertAdjacentHTML('afterbegin', markUp);

  // Rerendering new category button to add categoryBtn class
  filterBtnWrap.innerHTML = '';
  renderCategoryData(categoryData);

  e.target.elements.addCategory.value = '';
  modalCatBg.classList.remove('modal-cat-bg-active');
});

modalRemoveCatForm.addEventListener('submit', e => {
  e.preventDefault();
  const categoryName = e.target.elements.removeCategory.value;
  const categoryIndex = categoryData.findIndex(data => {
    return data === categoryName;
  });

  categoryData.splice(categoryIndex, 1);

  // handle for removing category button (if there is exist in the linksData, it won't be removed)

  // to inject category button to the UI
  filterBtnWrap.innerHTML = '';
  renderCategoryData(categoryData);
  // to inject category data to the UI (dropdown list)
  linkCategoryDropdown.innerHTML = '';
  injectCategory(categoryData);
  modalCatRemoveBg.classList.remove('modal-cat-remove-bg-active');
  e.target.elements.removeCategory.value = '';
});

// filtering link data by clicking category button
const filterLink = () => {
  const categoryBtns = document.querySelectorAll('.categoryBtn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      console.log(e.target.textContent);
      const categoryName = e.target.textContent;
      const matchLinks = linksData.filter(data => {
        return data.linkCategory === categoryName;
      });

      console.log('match links', matchLinks);
      // rerender link data card with filtered link data
      cardWrap.innerHTML = '';
      renderLinkDataCard(matchLinks);

      // handle for all button
      if (e.target.textContent === 'All') {
        renderLinkDataCard(linksData);
      }
    });
  });
};

// Show category button from the array list to the UI
const renderCategoryData = list => {
  list.forEach(category => {
    const markUp = `
        <button class="categoryBtn">${category}</button>
      `;
    filterBtnWrap.insertAdjacentHTML('beforeend', markUp);
  });
  filterLink();
};

renderCategoryData(categoryData);

// Inject dropdown data from js (category dropdown list)
const injectCategory = list => {
  const listData = list.slice(1, list.length);
  listData.forEach(data => {
    const markUp = `
      <option value=${data}>${data}</option>
    `;
    linkCategoryDropdown.insertAdjacentHTML('afterbegin', markUp);
  });
};

injectCategory(categoryData);

// Rendering links data card
const renderLinkDataCard = list => {
  list.forEach(data => {
    const markup = `
      <div class="card" data-link="${data.id}">
        <div class="card__top">
          <span>Share</span>
          <span>Fav</span>
        </div>

        <div class="card__content">
          <div class="card__title">
            <a href=${data.link} target="_blank" >${data.title}</a>
          </div>
          <div class="card__description">
            <p>
              ${data.description}
            </p>
          </div>
        </div>

        <div class="card__bottom">
          <i class="far fa-edit" id="edit-card"></i>
          <i class="far fa-trash-alt" id="delete-card" ></i>
        </div>
    </div>
    `;

    cardWrap.insertAdjacentHTML('afterbegin', markup);

    // handle for delete link data card
    document.querySelector('#delete-card').addEventListener('click', e => {
      const cardId = e.target.parentNode.parentNode.dataset.link;
      if (cardId) {
        deleteCard(cardId);
      }
    });

    // handle for edit link data card
    document.querySelector('#edit-card').addEventListener('click', e => {
      const cardId = e.target.parentNode.parentNode.dataset.link;
      console.log('Editing ...', cardId);
      modalBgEdit.classList.add('modal-bg-edit-active');

      const markup = `
          <form class="modal__edit-form">
            <label for="title-edit">Title: </label>
            <input type="text" name="title-edit" id="title-edit" />
            <label for="description-edit">Description: </label>
            <input type="text" name="description-edit" id="description-edit" />
            <label for="link-edit">Link: </label>
            <textarea name="link-edit" id="link-edit"></textarea>
            <select name="category-edit" id="category-edit">
              <!-- <option value="design">Design</option>
              <option value="programming">Programming</option>
              <option value="fashion">Fashion</option> -->
            </select>

            <button type="submit" class="add-link-btn-edit">Edit Link Data</button>
            <span class="modal-close-edit">X</span>
          </form>
      `;
      modalBgEdit.innerHTML = markup;
      document
        .querySelector('.modal-close-edit')
        .addEventListener('click', e => {
          modalBgEdit.classList.remove('modal-bg-edit-active');
        });
    });
  });
};

renderLinkDataCard(linksData);

// Handle search data link
searchEl.addEventListener('input', e => {
  let input = e.target.value.toLowerCase();
  const dataList = linksData.filter(data => {
    return data.title.toLowerCase().includes(input);
  });

  cardWrap.innerHTML = '';
  renderLinkDataCard(dataList);
});

// Handle delete link data card
const deleteCard = id => {
  if (id !== undefined) {
    const dataIndex = linksData.findIndex(data => {
      return data.id === id;
    });
    linksData.splice(dataIndex, 1);
    // Rerender data link card
    cardWrap.innerHTML = '';
    renderLinkDataCard(linksData);
    console.log('after deleting', linksData);
  } else {
    console.log('SHITTTT');
  }
};

// Handle edit link data card
const editCard = id => {};
