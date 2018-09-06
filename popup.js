//global variables
let DOM;
let article_title;
let article_author;
let website_title;
let page_url;
let published_date = "n.d.";
let date_unformatted = new Date();
let type_of_citation;
let selected_inputs = [];
let date_formatted = formatDate(date_unformatted.toString());

//dom elements
const button_fills_left = [...document.querySelectorAll(".button-fill-left")];
const button_fills_right = [...document.querySelectorAll(".button-fill-right")];
const citation_options = [...document.querySelectorAll(".citation__option")];
const proper_formats = [...document.querySelectorAll(".proper-format-block")];
const inputs = [...document.querySelectorAll("input")];
const citation_container = document.querySelector(".citation");
const hide_container = document.querySelector(".hide-container");
const powered_by = document.querySelector(".powered-by");
const logo = document.querySelector(".logo");
const copy_btn = document.querySelector(".copy");
const submit_edits = document.querySelector(".submit-edits");

//citation formats
const mla = document.createElement("div");

//chrome functions to get entire DOM
chrome.tabs.executeScript(
  {
    code: "document.documentElement.innerHTML"
  },
  response => {
    DOM = response[0].trim();
    getAllInformation(DOM);
  }
);

//event listeners
powered_by.addEventListener("click", () => {
  chrome.tabs.create({
    active: true,
    url: "https://penandthepad.com/create-citation"
  });
});

logo.addEventListener("click", () => {
  chrome.tabs.create({
    active: true,
    url: "https://penandthepad.com/create-citation"
  });
});

citation_options.forEach(el => {
  let data_id = el.getAttribute("data-id");
  let right_target;
  let left_target;
  el.addEventListener("mouseover", () => {
    right_target = getButtonFillRight(data_id);
    left_target = getButtonFillLeft(data_id);
    right_target.style.width = "50%";
    right_target.style.right = "0";
    left_target.style.width = "50%";
    left_target.style.left = "0";
  });
  el.addEventListener("mouseleave", () => {
    right_target.style.width = "0";
    right_target.style.right = "50%";
    left_target.style.width = "0";
    left_target.style.left = "50%";
  });
  el.addEventListener("click", () => {
    type_of_citation = data_id;
    for (let i = 0; i < proper_formats.length; i++) {
      if (proper_formats[i].getAttribute("data-id") !== type_of_citation) {
        proper_formats[i].style.display = "none";
      } else {
        proper_formats[i].style.display = "block";
      }
    }
    removeBorder();
    el.style.border = "solid 1px red";
    hide_container.style.display = "block";
    getAppropriateInputs(type_of_citation);
    fillInputs();
    fillCitation(type_of_citation);
  });
});

submit_edits.addEventListener("mouseover", function() {
  let data_id = this.getAttribute("data-id");
  let right_target;
  let left_target;
  right_target = getButtonFillRight(data_id);
  left_target = getButtonFillLeft(data_id);
  right_target.style.width = "50%";
  right_target.style.right = "0";
  left_target.style.width = "50%";
  left_target.style.left = "0";
});

submit_edits.addEventListener("mouseleave", function() {
  let data_id = this.getAttribute("data-id");
  let right_target;
  let left_target;
  right_target = getButtonFillRight(data_id);
  left_target = getButtonFillLeft(data_id);
  right_target.style.width = "0";
  right_target.style.right = "50%";
  left_target.style.width = "0";
  left_target.style.left = "50%";
});

copy_btn.addEventListener("click", () => {
  const copy_this = citation_container.innerText;
  navigator.clipboard.writeText(copy_this);
});

submit_edits.addEventListener("click", () => {
  fillCitation(type_of_citation);
  updateInputs();
  fillInputs();
});

function removeBorder() {
  citation_options.forEach(el => {
    el.style.border = "solid 1px black";
  });
}

function getAppropriateInputs(type) {
  for (let i = 0; i < inputs.length; i++) {
    let id = inputs[i].getAttribute("id");
    if (id.includes(type)) {
      selected_inputs.push(inputs[i]);
    } else {
      inputs[i].parentElement.style.display = "none";
    }
  }
  const correct_inputs = document.querySelector(`.${type}-format-inputs`);
  correct_inputs.style.display = "block";
}

function fillInputs() {
  for (let i = 0; i < selected_inputs.length; i++) {
    let type_of_input = selected_inputs[i].getAttribute("data-id");
    switch (type_of_input) {
      case "name":
        selected_inputs[i].value = article_author;
        break;
      case "article-title":
        selected_inputs[i].value = article_title;
        break;
      case "website-title":
        selected_inputs[i].value = website_title;
        break;
      case "date":
        selected_inputs[i].value = published_date;
        break;
      case "access":
        selected_inputs[i].value = date_formatted;
        break;
      case "url":
        selected_inputs[i].value = page_url;
        break;
    }
  }
}

function updateInputs() {
  for (let i = 0; i < selected_inputs.length; i++) {
    let type_of_input = selected_inputs[i].getAttribute("data-id");
    switch (type_of_input) {
      case "name":
        article_author = selected_inputs[i].value;
        break;
      case "article-title":
        article_title = selected_inputs[i].value;
        break;
      case "website-title":
        website_title = selected_inputs[i].value;
        break;
      case "date":
        published_date = selected_inputs[i].value;
        break;
      case "access":
        date_formatted = selected_inputs[i].value;
        break;
      case "url":
        page_url = selected_inputs[i].value;
        break;
    }
  }
}

function fillCitation(type) {
  switch (type) {
    case "mla":
      for (let i = 0; i < selected_inputs.length; i++) {
        let type_of_input = selected_inputs[i].getAttribute("data-id");
        switch (type_of_input) {
          case "name":
            citation_container.innerHTML = `${selected_inputs[i].value}. `;
            break;
          case "article-title":
            citation_container.innerHTML += `"${selected_inputs[i].value}." `;
            break;
          case "website-title":
            let span = document.createElement("span");
            span.className = "italics";
            span.innerHTML = `${selected_inputs[i].value}, `;
            citation_container.appendChild(span);
            break;
          case "date":
            citation_container.innerHTML += `${selected_inputs[i].value}, `;
            break;
          case "url":
            citation_container.innerHTML += `${selected_inputs[i].value}.`;
            break;
        }
      }
      break;
    case "apa":
      for (let i = 0; i < selected_inputs.length; i++) {
        let type_of_input = selected_inputs[i].getAttribute("data-id");
        switch (type_of_input) {
          case "name":
            citation_container.innerHTML = `${selected_inputs[i].value}. `;
            break;
          case "article-title":
            let span = document.createElement("span");
            span.className = "italics";
            span.innerHTML = `${selected_inputs[i].value}. `;
            citation_container.appendChild(span);
            break;
          case "date":
            citation_container.innerHTML += `(${selected_inputs[i].value}). `;
            break;
          case "url":
            citation_container.innerHTML += `${selected_inputs[i].value}.`;
            break;
        }
      }
      break;
    case "chicago":
      citation_container.innerHTML = "";
      for (let i = 0; i < selected_inputs.length; i++) {
        let type_of_input = selected_inputs[i].getAttribute("data-id");
        switch (type_of_input) {
          case "name":
            citation_container.innerHTML = `${selected_inputs[i].value}. `;
            break;
          case "article-title":
            citation_container.innerHTML += `"${selected_inputs[i].value}." `;
            break;
          case "website-title":
            citation_container.innerHTML += `${selected_inputs[i].value}. `;
            break;
          case "date":
            citation_container.innerHTML += `${selected_inputs[i].value}, `;
            break;
          case "access":
            citation_container.innerHTML += `${selected_inputs[i].value}, `;
            break;
          case "url":
            citation_container.innerHTML += `${selected_inputs[i].value}.`;
            break;
        }
      }
      break;
  }
}

//get left and right button fills
function getButtonFillLeft(id) {
  for (let i = 0; i < button_fills_left.length; i++) {
    if (button_fills_left[i].getAttribute("data-id") === id) {
      return button_fills_left[i];
    }
  }
}

function getButtonFillRight(id) {
  for (let i = 0; i < button_fills_right.length; i++) {
    if (button_fills_right[i].getAttribute("data-id") === id) {
      return button_fills_right[i];
    }
  }
}

//get information
function getAllInformation(dom) {
  getTitleOfPage(dom);
  getURLandAuthor();
}

//helper functions
function formatDate(date) {
  let date_string = "";
  const date_array = date.split(" ");
  date_string += date_array[3] + ", ";
  date_string += date_array[1] + " ";
  date_string += date_array[2];
  return date_string;
}

//loop through DOM for relevant info
function getTitleOfPage(dom) {
  let dom_array = dom.split("</title>");
  let second_array = dom_array[0].split("<title>");
  article_title = second_array[1].trim();
}

//get the name the author (site name) and the url
function getURLandAuthor() {
  chrome.tabs.executeScript(
    {
      code: "window.location.href"
    },
    url => {
      page_url = url[0];
      if (page_url.includes("www")) {
        let cap_first = page_url.split(".")[1];
        article_author = cap_first.charAt(0).toUpperCase() + cap_first.slice(1)
        website_title = article_author;
      } else {
        let split_on_period = page_url.split(".")[0];
        let cap_first = split_on_period.split("//")[1];
        article_author = cap_first.charAt(0).toUpperCase() + cap_first.slice(1)
        website_title = article_author;
      }
    }
  );
}
