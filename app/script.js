/*jshint esversion: 6 */
/* Initial selector/variable assignments
==============================================================================*/
const streamersList = document.querySelector('#streamers-list');
const loadingIcon   = document.querySelector('#loading-icons');

const channelID = [
  'kindafunnygames', 'bikeman', 'syndicate', 'nightblue3', 'summit1g',
  'mightymae', 'kaypikefashion', 'anuxinamoon', 'lifewithlaughs',
  'harukatsune', 'food', 'derptyme', 'aidenwallis', 'ryzeinc', 'idevelopthings',
  'casey_works', 'riotgames', "ESL_SC2", "OgamingSC2",
];

const filterBtn = [
  document.querySelector('#user-filter > ul > li:nth-of-type(1)'),
  document.querySelector('#user-filter > ul > li:nth-of-type(2)'),
  document.querySelector('#user-filter > ul > li:nth-of-type(3)')
];

let channelStatus = []; // [online, offline]
let channels = [];

function updateList() {
  channels = [];
  filterReset();
  streamersList.innerHTML = '';
  loadingIcon.classList.remove("hidden");
  channelID.forEach(channel => getChannelStatus(channel));
} updateList();

/* Getting Stream information
==============================================================================*/
/** @function getChannelStatus();
 * Get online streaming channel infromation and update the streamersList object.
 * if the channel is not streaming, get the general channel infromation.
 */
function getChannelStatus(id) {
  let xhr  = new XMLHttpRequest();
  let key  = '?client_id=g1a42ix3f73s30q9ox5mb9snbrma1sq';
  let link = 'https://api.twitch.tv/kraken/streams/';
  xhr.open('GET', link + id + key, true);
  xhr.send(null);
  xhr.onerror = connectionErr;
  xhr.onload = () => {
    let data = JSON.parse(xhr.response);
    if (data.stream !== null) { // Channel online
      channels.push(itemComponent(id, data.stream, true));
    } else {
      getChannelInfo(id, data._links.channel);
    }
    display(channels);
  };
}

/* Getting Channel information (For offline users)
==============================================================================*/
/** @function getChannelInfo(id, link)
 * Get general channel infromation and update the streamersList object.
 * Also, asynchronously update the online/offline channels array.
 */
function getChannelInfo(id, link) {
  let xhr = new XMLHttpRequest();
  let key = '?client_id=g1a42ix3f73s30q9ox5mb9snbrma1sq';
  xhr.open('GET', link + key, true);
  xhr.send(null);
  xhr.onload = () => {
    let userItem;
    let data = JSON.parse(xhr.response);
    if (data.status !== 404) { // User offline
      channels.push(itemComponent(id, data, false));
    } else {
      channels.push(null);
    }
    display(channels);
  };
}


/* Display channels all at once
==============================================================================*/
function display(channels) {
  if (channels.length === channelID.length) {
    channels.forEach(
      channel => {if (channel !== null) {streamersList.innerHTML += channel;}
    });
    channelStatus[0] = streamersList.querySelectorAll('.online');
    channelStatus[1] = streamersList.querySelectorAll('.offline');
    loadingIcon.classList.add("hidden");
  }
}

/* User Item Component
==============================================================================*/
function itemComponent(id, data, online) {
  if (online) {
      return `
      <li id='${id}' class='flex-c online'>
        <a class="flex-r user-item" href='${data.channel.url}' target='_blank'>
          <div class="flex-c user-img">
            ${data.channel.logo ?  '<img src=' + data.channel.logo + '>' : '<i class="fa fa-twitch"></i>'}
          </div>
          <div class="flex-c user-info">
            <div class="flex-r">
              <h3><i class="fa fa-check-circle"></i> ${data.channel.display_name}</h3>
              <p class="user-extra-info">
                <i class='fa fa-eye'></i> ${data.viewers} &nbsp
                <i class='fa fa-user'></i> ${data.channel.followers} &nbsp
                <i class='fa fa-tags'></i> ${data.game}
              </p>
            </div>
            <p class="user-status"><i class='fa fa-twitch'></i> ${data.channel.status}</p>
          </div>
        </a>
      </li>`;
  } else {
      return `
      <li id='${id}' class='flex-c offline'>
        <a class="flex-r user-item" href='${data.url}' target='_blank'>
          <div class="flex-c user-img">
            ${data.logo ?  '<img src=' + data.logo + '>' : '<i class="fa fa-twitch"></i>'}
          </div>
          <div class="flex-c user-info">
            <h3><i class="fa fa-times-circle"></i> ${data.display_name}</h3>
            <p class="user-status"><i class='fa fa-twitch'></i> User offline.</p>
          </div>
        </a>
      </li>`;
  }
}

/* Network Error Alert
==============================================================================*/
function connectionErr() {
  streamersList.innerHTML = '<h2 id="NetworkErr">Unable to connect to the intrenet, Please check your network connection</h2>';
}

/* User Filter buttons
==============================================================================*/
filterBtn[0].addEventListener("click", showAll);
filterBtn[1].addEventListener("click", showOnline);
filterBtn[2].addEventListener("click", showOffline);

function filterReset() {
  filterBtn[0].classList.add("all-active");
  filterBtn[1].classList.remove("online-active");
  filterBtn[2].classList.remove("offline-active");
}

function showAll() {
  filterBtn[0].classList.add("all-active");
  filterBtn[1].classList.remove("online-active");
  filterBtn[2].classList.remove("offline-active");
  channelStatus[0].forEach(channel => channel.classList.remove("hidden"));
  channelStatus[1].forEach(channel => channel.classList.remove("hidden"));
}

function showOnline() {
  filterBtn[0].classList.remove("all-active");
  filterBtn[1].classList.add("online-active");
  filterBtn[2].classList.remove("offline-active");
  channelStatus[1].forEach(channel => channel.classList.add("hidden"));
  channelStatus[0].forEach(channel => channel.classList.remove("hidden"));
}

function showOffline() {
  filterBtn[0].classList.remove("all-active");
  filterBtn[1].classList.remove("online-active");
  filterBtn[2].classList.add("offline-active");
  channelStatus[0].forEach(channel => channel.classList.add("hidden"));
  channelStatus[1].forEach(channel => channel.classList.remove("hidden"));
}

/* Refresh button
==============================================================================*/
const refreshBtn = document.querySelector('#user-filter > ul > li:last-child');
refreshBtn.addEventListener("click", updateList);

/* Adding project Details
==============================================================================*/
addProjDetails(0, 'Project Overview', 'This is a dashboard application for the TwitchTV application. It can be used to track several Twitch channels to display their current status, number of viewers, followers, category, and what they’re streaming if they’re online.');
addProjDetails(0, 'Techniques/Technologies', 'This project had no complex components. AJAX was used for better client-side interactivity, some asynchronous techniques for faster processing, and HTML and CSS was used for structure and presentation. I added some display transition and animation for a better UX.');

addProjDetails(1, 'Future Implementations', 'I  am interested into adding a channel search bar for users to display their favourite Twitch streamers. This is easy and could take me less than an hour. But these projects were built for practice. So this is at the bottom of my priority list unless directly requested.');
addProjDetails(1, 'Reflection', 'It was a nice practice to interact with a modern API and learn more about reading / understanding documentations.');
