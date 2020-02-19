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
const favToggle = document.querySelector('#fav-toggle');
const favLinks = document.querySelector('.favourite-links');

let linksData = [];
let categoryData = [
  'All',
  'Design',
  'Programming',
  'CSS',
  'Javascript',
  'Knowledge'
];

let favouriteLinks = [];

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
          <button class="favourite__love" id="fav-btn">
            <svg>
              <use href="../img/icons.svg#icon-heart-outlined"></use>
            </svg>
          </button>
          
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

  // Check inputs to push data into linksData
  const now = moment().valueOf();
  if (title.length > 0 && link.length > 0) {
    linksData.push({
      id,
      title,
      description,
      link,
      linkCategory,
      createdAt: now,
      updatedAt: now
    });
    e.target.elements.title.value = '';
    e.target.elements.description.value = '';
    e.target.elements.link.value = '';
    modalBg.classList.remove('modal-bg-active');

    cardWrap.insertAdjacentHTML('afterbegin', markUp);

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

// To change favourite icon style
const isFavourite = id => {
  const favData = favouriteLinks.findIndex(data => {
    return data.id === id;
  });
  if (favData !== -1) {
    return true;
  } else {
    return false;
  }
};
// Change favourite SVG style
const setFav = cardId => {
  let iconString = isFavourite(cardId) ? 'icon-heart' : 'icon-heart-outlined';
  document
    .querySelector('.favourite__love use')
    .setAttribute('href', `../img/icons.svg#${iconString}`);
};

// Rendering links data card
const renderLinkDataCard = list => {
  list.forEach(data => {
    const markup = `
      <div class="card" data-link="${data.id}">
        <div class="card__top">
          <span>Share</span>
          <button class="favourite__love" id="fav-btn">
            <svg>
              <use href="../img/icons.svg#icon-heart-outlined"></use>
            </svg>
          </button>
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
      // Find edit card data from the linksData array (with specific ID)
      const linkData = linksData.find(data => {
        return data.id === cardId;
      });
      // Inject link data edit form
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

      // Set link data to the edit form input fields
      document.querySelector('#title-edit').value = linkData.title;
      document.querySelector('#description-edit').value = linkData.description;
      document.querySelector('#link-edit').value = linkData.link;
      const linkEditCategory = document.querySelector('#category-edit');
      const categoryList = categoryData.slice(1, categoryData.length); // slice first index (slice All not to include to the dropdown list)

      // loop over category list to inject dropdown value to the HTML
      categoryList.forEach(category => {
        // check to make selected from the previous dropdown value (linkData.linkCategory)
        if (category === linkData.linkCategory) {
          const catSpecOption = `
            <option value="${category}" selected>${category}</option>
          `;
          linkEditCategory.insertAdjacentHTML('afterbegin', catSpecOption);
        } else {
          const catOption = `
            <option value="${category}">${category}</option>
         `;
          linkEditCategory.insertAdjacentHTML('afterbegin', catOption);
        }
      });

      // Handle form submit for editing link data
      document
        .querySelector('.modal__edit-form')
        .addEventListener('submit', e => {
          e.preventDefault();
          linkData.title = document.querySelector('#title-edit').value;
          linkData.description = document.querySelector(
            '#description-edit'
          ).value;
          linkData.link = document.querySelector('#link-edit').value;
          linkData.linkCategory = document.querySelector(
            '#category-edit'
          ).value;

          console.log(linkData.updatedAt);
          linkData.updatedAt = moment().valueOf();
          console.log(linkData.updatedAt);

          cardWrap.innerHTML = '';
          renderLinkDataCard(linksData);

          modalBgEdit.classList.remove('modal-bg-edit-active');
        });
    });

    // Handle for adding link data to the favourite
    let styleFavIcon = false;
    document.querySelector('#fav-btn').addEventListener('click', e => {
      styleFavIcon = styleFavIcon ? false : true;
      console.log(styleFavIcon);
      // Favourite icon style
      const setFavStyle = isFav => {
        // To add favourite svg active for the target card element
        Array.from(e.target.children).forEach(el => {
          console.log(el.children);
          // el.children.setAttribute('href', '../img/icons.svg#icon-heart');
          Array.from(el.children).forEach(element => {
            // console.log(element);

            let iconString = isFav ? 'icon-heart' : 'icon-heart-outlined';
            element.setAttribute('href', `../img/icons.svg#${iconString}`);
          });
        });
      };

      const cardId = e.target.parentNode.parentNode.dataset.link;
      const linkData = linksData.find(data => {
        return data.id === cardId;
      });

      if (styleFavIcon) {
        favouriteLinks.push({
          id: linkData.id,
          title: linkData.title,
          description: linkData.description
        });
        setFavStyle(styleFavIcon);
        favLinks.innerHTML = '';
        renderFavDataList(favouriteLinks);
      } else {
        setFavStyle(styleFavIcon);
        removeLinkFromFav(cardId);
      }

      // // To add favourite svg active for the target card element
      // Array.from(e.target.children).forEach(el => {
      //   console.log(el.children);
      //   // el.children.setAttribute('href', '../img/icons.svg#icon-heart');
      //   Array.from(el.children).forEach(element => {
      //     // console.log(element);
      //     element.setAttribute('href', '../img/icons.svg#icon-heart');
      //   });
      // });
    });

    setFav(data.id);
  });
};

renderLinkDataCard(linksData);

// Render favourite link data list
const renderFavDataList = favList => {
  favList.forEach(list => {
    const markup = `
    <div class="favourite">
      <a href="#" class="fav-title">${list.title}</a>
      <div class="fav-description">${list.description}</div>
    </div>
    `;

    favLinks.insertAdjacentHTML('afterbegin', markup);
  });
};

renderFavDataList(favouriteLinks);

// Remove data link from the favourite list
const removeLinkFromFav = id => {
  const dataIndex = favouriteLinks.findIndex(data => {
    return data.id === id;
  });
  favouriteLinks.splice(dataIndex, 1);
  favLinks.innerHTML = '';
  renderFavDataList(favouriteLinks);
};

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
  } else {
    console.log('SHITTTT');
  }
};

// Handle for favourite data link toggle
favToggle.addEventListener('click', e => {
  favLinks.classList.toggle('favourite-active');
});

// Handle for sorting data link card
const sortLinksData = (dataList, sortType) => {
  if (sortType === 'byCreated') {
    return dataList.sort((a, b) => {
      if (a.createdAt < b.createdAt) {
        return -1;
      } else if (a.createdAt > b.createdAt) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortType === 'byAlphabetical') {
    return dataList.sort((a, b) => {
      if (a.title.toLowerCase() > b.title.toLowerCase()) {
        return -1;
      } else if (a.title.toLowerCase() < b.title.toLowerCase()) {
        return 1;
      } else {
        return 0;
      }
    });
  } else if (sortType === 'byEdited') {
    return dataList.sort((a, b) => {
      if (a.updatedAt < b.updatedAt) {
        return -1;
      } else if (a.updatedAt > b.updatedAt) {
        return 1;
      } else {
        return 0;
      }
    });
  }
};
document.querySelector('#sortBy').addEventListener('change', e => {
  const sort = e.target.value;
  const sortedLinksData = sortLinksData(linksData, sort);
  // linksData = sortedLinksData;
  cardWrap.innerHTML = '';
  renderLinkDataCard(sortedLinksData);
  console.log(sortedLinksData);

  // console.log(e.target.value);
});
