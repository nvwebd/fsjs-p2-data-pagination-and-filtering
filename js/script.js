'use strict';
/*
Treehouse Techdegree:
FSJS Project 2 - Data Pagination and Filtering
*/

import { data } from './data.js';

/**
 * Items per Page - change this to show more/less items on a page
 * @type {number}
 */
const itemsPerPage = 9;

const findStudents = (searchString) => {
  return data.filter((student) => {
    if (
      student.name.first.includes(searchString) ||
      student.name.last.includes(searchString)
    ) {
      return student;
    }
  });
};

/**
 * dynamically render a search bar into the DOM
 */
const addSearchInput = () => {
  const headerContainer = document.querySelector('.header');

  headerContainer.insertAdjacentHTML(
    `beforeend`,
    `<label for="search" class="student-search">
            <span>Search by name</span>
            <input id="search" placeholder="Search by name...">
            <button type="button"><img src="/img/icn-search.svg" alt="Search icon"></button>
          </label>`
  );

  headerContainer.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON' || event.target.tagName === 'IMG') {
      const searchString = document.getElementById('search');
      const foundValues = findStudents(searchString.value);

      showPage(foundValues, 1);
      addPagination(foundValues);
    }
  });

  headerContainer.addEventListener('keyup', (event) => {
    const foundValues = findStudents(event.target.value);

    showPage(foundValues, 1);
    addPagination(foundValues);
  });
};

/**
 * Function that Renders the studen data objects into the page
 * @param studentList - the data array of all students
 *
 * @param currentPage - which page of students should be rendered on the page
 */
const showPage = (studentList, currentPage) => {
  const studentListUl = document.querySelector('.student-list');
  studentListUl.innerHTML = '';

  /**
   * no students found - show no content container
   */
  if (studentList.length === 0) {
    const noContentContainer = document.createElement('div');
    noContentContainer.className = 'no-results';
    noContentContainer.textContent = 'No results';

    studentListUl.prepend(noContentContainer);
    return;
  }

  const startIndex = currentPage * itemsPerPage - itemsPerPage;
  const endIndex = currentPage * itemsPerPage;

  studentList.forEach((student, index) => {
    if (index >= startIndex && index < endIndex) {
      studentListUl.insertAdjacentHTML(
        'beforeend',
        `<li class="student-item cf">
          <div class="student-details">
            <img class="avatar" src=${student.picture.large} alt="Profile Picture">
            <h3>${student.name.first} ${student.name.last}</h3>
            <span class="email">${student.email}</span>
          </div>
          <div class="joined-details">
            <span class="date">Joined ${student.registered.date}</span>
          </div>
        </li>`
      );
    }
  });
};

/*
Create the `addPagination` function
This function will create and insert/append the elements needed for the pagination buttons
*/

/**
 * render the pagination container with set current active element, action for changing current selecte page
 * @param paginationList - data array of students to create a pagination based on the length
 */
const addPagination = (paginationList) => {
  /**
   * calculate pagination items length
   * @type {number}
   */
  const paginationLength = Math.ceil(paginationList.length / itemsPerPage);

  /**
   * main pagination wrapper - clear it first to render a clear state
   * @type {Element}
   */
  const linkList = document.querySelector('.link-list');
  linkList.innerHTML = '';

  /**
   * add event listener that targets buttons and switches the current active pagination item
   */
  linkList.addEventListener('click', (event) => {
    if (event.target.tagName === 'BUTTON') {
      for (let li = 0; li < linkList.children.length; li++) {
        if (Number(event.target.textContent) === li + 1) {
          linkList.children[li].children[0].setAttribute('class', 'active');
        } else {
          linkList.children[li].children[0].removeAttribute('class');
        }
      }

      showPage(paginationList, Number(event.target.textContent));
    }
  });

  for (let i = 0; i < paginationLength; i++) {
    linkList.insertAdjacentHTML(
      'beforeend',
      `<li>
                <button type="button" class=${i === 0 ? 'active' : null}>${
        i + 1
      }</button>
              </li>`
    );
  }
};

/**
 * main start function that calls all other functions to bootstrap the logic
 */
const main = () => {
  addSearchInput();
  showPage(data, 1);
  addPagination(data);
};

/**
 * call main logic function - throwback to C++ :D
 */
main();
