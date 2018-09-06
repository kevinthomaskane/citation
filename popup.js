//global variables
let DOM;
let article_title;
let article_author;
let page_url;
let published_date = "n.d.";
let date_unformatted = new Date();
let type_of_citation;
let selected_inputs = [];
const date_formatted = formatDate(date_unformatted.toString());

//dom elements
const button_fills_left = [...document.querySelectorAll(".button-fill-left")];
const button_fills_right = [...document.querySelectorAll(".button-fill-right")];
const citation_options = [...document.querySelectorAll(".citation__option")];
const proper_formats = [...document.querySelectorAll(".proper-format-block")];
const inputs = [...document.querySelectorAll("input")];
const citation_container = document.querySelector(".citation");


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
    getAppropriateInputs(type_of_citation);
    fillInputs();
    fillCitation(type_of_citation);
  });
});

function getAppropriateInputs(type) {
  for (let i = 0; i < inputs.length; i++) {
    let id = inputs[i].getAttribute("id");
    if (id.includes(type)) {
      selected_inputs.push(inputs[i]);
    }
  }
}

function fillInputs(){
  for (let i = 0; i < selected_inputs.length; i++){
    let type_of_input = selected_inputs[i].getAttribute("data-id");
    switch (type_of_input){
      case "name" :
      selected_inputs[i].value = article_author;
      break;
      case "article-title" :
      selected_inputs[i].value = article_title;
      break;
      case "website-title" :
      selected_inputs[i].value = article_author;
      break;
      case "date" :
      selected_inputs[i].value = published_date;
      break;
      case "url" :
      selected_inputs[i].value = page_url;
      break;
    }
  }
}

function fillCitation(type){
  switch (type) {
    case "mla":
    for (let i = 0; i < selected_inputs.length; i++){
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
        span.innerHTML = `${selected_inputs[i].value}, `
        citation_container.appendChild(span);
        break;
        case "date":
        citation_container.innerHTML += `${selected_inputs[i].value}, `;
        break;
        case "url":
        citation_container.innerHTML += `${selected_inputs[i].value}.`
      }
    }
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
      article_author = page_url.split(".")[1];
    }
  );
}
