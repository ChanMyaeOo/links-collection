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

// Get data from localStorage
// const getFromStorage = () => {
//   const links = localStorage.getItem('linksData');

//   try {
//     return links ? JSON.parse(links) : [];
//   } catch (e) {
//     return [];
//   }
// };

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

// Check localStorage and assign values to linksData (if localStorage is not equal null)
if (localStorage.getItem('linksData') !== null) {
  console.log('NULL');
  linksData = JSON.parse(localStorage.getItem('linksData'));
  console.log(linksData);
}

// Save data to localStorage
const saveToStorage = (dataKey, data) => {
  localStorage.setItem(`${dataKey}`, JSON.stringify(data));
};

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
  let description =
    e.target.elements.description.value !== ''
      ? e.target.elements.description.value
      : '---';
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
              ${description}
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
    const newData = {
      id,
      title,
      description,
      link,
      linkCategory,
      createdAt: now,
      updatedAt: now
    };
    linksData.push(newData);
    saveToStorage('linksData', linksData);
    e.target.elements.title.value = '';
    e.target.elements.description.value = '';
    e.target.elements.link.value = '';
    modalBg.classList.remove('modal-bg-active');

    cardWrap.insertAdjacentHTML('afterbegin', markUp);

    cardWrap.innerHTML = '';
    renderLinkDataCard(linksData);
    showPagination();
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
  if (category !== '') {
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
  }
});

modalRemoveCatForm.addEventListener('submit', e => {
  e.preventDefault();
  const categoryName = e.target.elements.removeCategory.value;
  const categoryIndex = categoryData.findIndex(data => {
    return data === categoryName;
  });

  if (categoryIndex !== -1) {
    categoryData.splice(categoryIndex, 1);

    // to inject category button to the UI
    filterBtnWrap.innerHTML = '';
    renderCategoryData(categoryData);
    // to inject category data to the UI (dropdown list)
    linkCategoryDropdown.innerHTML = '';
    injectCategory(categoryData);
    modalCatRemoveBg.classList.remove('modal-cat-remove-bg-active');
    e.target.elements.removeCategory.value = '';
  }
});

// filtering link data by clicking category button
const filterLink = () => {
  const categoryBtns = document.querySelectorAll('.categoryBtn');
  categoryBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      const categoryName = e.target.textContent;
      const matchLinks = linksData.filter(data => {
        return data.linkCategory === categoryName;
      });

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
  const favourLinks = JSON.parse(localStorage.getItem('favLinks'));

  if (favourLinks !== null) {
    const favData = favourLinks.findIndex(data => {
      return data.id === id;
    });

    if (favData !== -1) {
      return true;
    } else {
      return false;
    }
  }
};

// Change favourite SVG style
const setFav = cardId => {
  let iconString = isFavourite(cardId) ? 'icon-heart' : 'icon-heart-outlined';
  document
    .querySelector('.favourite__love use')
    .setAttribute('href', `../img/icons.svg#${iconString}`);
};

// Render favourite link data list
const renderFavDataList = favList => {
  favLinks.innerHTML = '';
  favList.forEach(list => {
    const markup = `
    <div class="favourite">
      <a href="${list.link}" target="_blank" class="fav-title">${list.title}</a>
      <div class="fav-description">${list.description}</div>
    </div>
    `;
    // favLinks.innerHTML = '';
    favLinks.insertAdjacentHTML('afterbegin', markup);
  });
};

const storageFavLinks = JSON.parse(localStorage.getItem('favLinks'));
if (storageFavLinks === null) {
  renderFavDataList([]);
} else {
  renderFavDataList(storageFavLinks);
}

// Remove data link from the favourite list
const removeLinkFromFav = id => {
  const dataIndex = favouriteLinks.findIndex(data => {
    return data.id === id;
  });
  favouriteLinks.splice(dataIndex, 1);
  saveToStorage('favLinks', favouriteLinks); // Refresh localStorage after removing fav
  favLinks.innerHTML = '';
  // renderFavDataList(favouriteLinks);
  renderFavDataList(JSON.parse(localStorage.getItem('favLinks')));
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
            
            <input type="text" name="title-edit" id="title-edit" class="input-edit"
            placeholder="Enter Title"/>
         
            <textarea
              name="description-edit"
              id="description-edit"
              cols="20"
              rows="4"
              placeholder="Enter Description"
              class="description-edit"
            ></textarea>
            <textarea name="link-edit" id="link-edit"
              cols="20"
              rows="4"
              placeholder="Enter Url"
              class="link-edit"
            ></textarea>
            <label for="category-edit" class="form-category-edit">
            <span>Choose Category :</span>
              <select name="category-edit" id="category-edit" class="category-edit">
                <!-- <option value="design">Design</option>
                <option value="programming">Programming</option>
                <option value="fashion">Fashion</option> -->
              </select>
            </label>
            <button type="submit" class="add-link-btn-edit">Update</button>
            <i class="far fa-times-circle modal-close-edit"></i>
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

          // to interactive with updated link data and favourite list
          const favLinks = JSON.parse(localStorage.getItem('favLinks'));
          favLinks.forEach(favLink => {
            console.log(favLink);
            if (favLink.id === linkData.id) {
              (favLink.title = linkData.title),
                (favLink.description = linkData.description),
                (favLink.link = linkData.link),
                (favLink.linkCategory = linkData.linkCategory);

              saveToStorage('favLinks', favLinks);
              favLinks.innerHTML = '';
              renderFavDataList(favLinks);
            }
          });
          // renderFavDataList(favLinks);

          linkData.updatedAt = moment().valueOf();

          cardWrap.innerHTML = '';
          // save to localStorage
          saveToStorage('linksData', linksData);
          renderLinkDataCard(linksData);

          modalBgEdit.classList.remove('modal-bg-edit-active');
        });
    });

    // Handle for adding link data to the favourite
    let styleFavIcon = false;
    document.querySelector('#fav-btn').addEventListener('click', e => {
      styleFavIcon = styleFavIcon ? false : true;
      // Favourite icon style
      const setFavStyle = isFav => {
        // To add favourite svg active for the target card element
        Array.from(e.target.children).forEach(el => {
          // console.log(el.children);
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
        const favourite = {
          id: linkData.id,
          title: linkData.title,
          description: linkData.description,
          link: linkData.link
        };
        favouriteLinks.push(favourite);
        saveToStorage('favLinks', favouriteLinks);
        setFavStyle(styleFavIcon);
        favLinks.innerHTML = '';

        renderFavDataList(favouriteLinks);
      } else {
        setFavStyle(styleFavIcon);
        removeLinkFromFav(cardId);
      }
    });

    setFav(data.id);
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
    // Refresh localStorage after deleting data
    saveToStorage();
    // Rerender data link card
    saveToStorage('linksData', linksData);
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
// Listen for sorting dropdown changes
document.querySelector('#sortBy').addEventListener('change', e => {
  const sort = e.target.value;
  const sortedLinksData = sortLinksData(linksData, sort);

  cardWrap.innerHTML = '';
  renderLinkDataCard(sortedLinksData);
});

// Handle for page pagination
const pageRows = 9;
let currentPage = 1;
const paginationItems = document.querySelector('.pagination__items');

const showPagination = () => {
  if (linksData.length > 9) {
    const displayCardList = (list, pageRows, page) => {
      currentPage = page;
      page--;
      let start = pageRows * page;
      let end = start + pageRows;
      let cardList = list.slice(start, end);

      cardWrap.innerHTML = '';
      renderLinkDataCard(cardList);
    };

    const setPagination = (list, pageRows) => {
      let paginationNum = Math.ceil(list.length / pageRows);
      paginationItems.innerHTML = '';
      for (let i = 1; i < paginationNum + 1; i++) {
        const button = paginationBtn(i, list);
        paginationItems.appendChild(button);
      }
    };

    const paginationBtn = (paginationNumber, list) => {
      const button = document.createElement('button');
      button.textContent = paginationNumber;
      button.classList.add('pagination-btn');

      button.addEventListener('click', e => {
        cardWrap.innerHTML = '';
        displayCardList(list, pageRows, e.target.textContent);
      });

      return button;
    };

    displayCardList(linksData, pageRows, currentPage);
    setPagination(linksData, pageRows);
  }
};

// Show default text for card section if there is no data in linksData

if (linksData.length === 0) {
  const paragraph = document.createElement('p');
  paragraph.textContent = 'Add your favourite links to the list :)';
  paragraph.classList.add('default-text');
  cardWrap.appendChild(paragraph);
}
