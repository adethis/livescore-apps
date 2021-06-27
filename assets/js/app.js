const DATE_NOW = new Date()
const monthNames = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_NAME = monthNames[DATE_NOW.getMonth()];
const DAY_NAME = String(DATE_NOW.getDate()).padStart(2, "0");
const YEAR = DATE_NOW.getFullYear();

$(document).ready(function() {
  getData();
  $("#loadingDiv")
    .hide()
    .ajaxStart(function () {
      $(this).show();
    })
    .ajaxStop(function () {
      $(this).hide();
    });
  window.onscroll = function () { fixedOnScroll() };
  $('.navbar-burger-mobile').on('click', function(e) {
    $('.navbar-list-menu').toggleClass('open');
    e.stopPropagation()
  });
  $('.collapse-stats').on('click', function(e) {
    $('.detail-board').toggleClass('open');
    $('.arrow').toggleClass('rotate');
    e.stopPropagation()
  });
  $(document).on('click', function(e) {
    if ($(e.target).is('.navbar-list-menu') === false) {
      $('.navbar-list-menu').removeClass('open');
    }
    if ($(e.target).is('.detail-board') === false) {
      $('.detail-board').removeClass('open');
    }
  });
});
$(document).on('click', '.collapse-stats', function(e) {
  const detail_board = $(this).parent().parent()[0].childNodes[1].childNodes[1]
  if (detail_board.className === 'detail-board') {
    $(this).parent().parent()[0].childNodes[1].childNodes[1].classList.add('open')
    $(this).context.childNodes[1].classList.add('rotate')
  } else {
    $(this).parent().parent()[0].childNodes[1].childNodes[1].classList.remove('open')
    $(this).context.childNodes[1].classList.remove('rotate')
  }
  
  e.stopPropagation()
});

let header = document.querySelector('.navbar');
function fixedOnScroll() {
  if (window.pageYOffset > header.offsetTop) {
    header.classList.add('fixed');
  } else {
    header.classList.remove('fixed');
  }
}

function getData() {
  $.ajax({
    url: `https://client.elevenscore.com/api/football/match/matchfixtures?date=${YEAR}${('0' + (DATE_NOW.getMonth()+1)).slice(-2)}10&utc=%2B7`,
    type: 'GET',
    headers: {'X-Api-Key': '24578cdb-fc01-4794-9bb0-865dd8ac405c'},
    dataType: 'json',
    success: function(response) {
      for (let i = 0; i < 9; i++) {
        $('.content').append(Card(response.result[i]))
      }
    },
    error: function (error) {
      console.log(error)
    }
  })
}

const Card = (data) => {
  let { matchTime, statusName, awayTeamEvent, homeTeamEvent } = data;
  matchTime = formatDate(matchTime)
  const node = document.createElement('div')
  node.classList = 'card'
  node.appendChild(CardHeader(matchTime))
  node.appendChild(CardBody({statusName, awayTeamEvent, homeTeamEvent}))
  node.appendChild(CardFooter())
  return node
}

const CardHeader = (params) => {
  const node = document.createElement('div')
  node.classList = 'card-header'
  const title = document.createElement('h3')
  title.classList = 'title'
  title.textContent = params
  const span = document.createElement('span')
  span.textContent = 'Member'
  node.appendChild(title)
  node.appendChild(span)
  return node
}

const CardBody = (params) => {
  const node = document.createElement('div')
  node.classList = 'card-body'
  node.appendChild(ScoreBoard(params))
  node.appendChild(DetailBoard(params))
  return node
}

const ScoreBoard = (params) => {
  const node = document.createElement('div')
  node.classList = 'score-board'
  node.appendChild(Team(params.awayTeamEvent))
  node.appendChild(Score(params))
  node.appendChild(Team(params.homeTeamEvent))
  return node
}

const Team = (params) => {
  const node = document.createElement('div')
  node.classList = 'team'
  const imageTeam = document.createElement('img')
  imageTeam.src = params.logoUrl
  const nameTeam = document.createElement('span')
  nameTeam.textContent = params.name
  node.appendChild(imageTeam)
  node.appendChild(nameTeam)
  return node
}

const Score = (params) => {
  const node = document.createElement('div')
  node.classList = 'score'
  const title = document.createElement('h3')
  title.textContent = params.awayTeamEvent.score + ' - ' + params.homeTeamEvent.score
  const span = document.createElement('span')
  span.textContent = params.statusName === 'Ending' ? 'FINAL' : params.statusName
  node.appendChild(title)
  node.appendChild(span)
  return node
}

const DetailBoard = (params) => {
  const node = document.createElement('div')
  node.classList = 'detail-board'
  node.appendChild(PossessionDetail())
  node.appendChild(TimelineActivity())
  return node
}

const PossessionDetail = () => {
  const node = document.createElement('div')
  node.classList = 'possession-detail'
  const stats1 = document.createElement('span')
  stats1.textContent = '63%'
  const statsText = document.createElement('span')
  statsText.classList = 'active'
  statsText.textContent = 'Possession'
  const stats2 = document.createElement('span')
  stats2.textContent = '37%'
  node.appendChild(stats1)
  node.appendChild(statsText)
  node.appendChild(stats2)
  return node
}

const TimelineActivity = () => {
  const node = document.createElement('div')
  node.classList = 'timeline-activity'
  node.appendChild(ActivityDetail('Kenneth Scott 13'))
  node.appendChild(ActivityDetail('Adam Webb 21'))
  node.appendChild(ActivityDetail('Henry Newt 14'))
  node.appendChild(ActivityDetail('Wayne Kelly 32'))
  return node
}

const ActivityDetail = (name, icon = null) => {
  const node = document.createElement('div')
  node.classList = 'timeline-act'
  const actDetail = document.createElement('span')
  actDetail.textContent = name
  node.appendChild(actDetail)

  return node
}

function CardFooter() {
  const node = document.createElement('div')
  node.classList = 'card-footer'
  const link = document.createElement('a')
  link.href = '#'
  link.classList = 'collapse-stats'
  const divText = document.createElement('div')
  divText.classList = 'text'
  const imageIcon = document.createElement('img')
  imageIcon.src = 'assets/images/ic_line-chart.svg'
  const span = document.createElement('span')
  span.textContent = 'Statistics'
  divText.appendChild(imageIcon)
  divText.appendChild(span)
  const divArrow = document.createElement('div')
  divArrow.classList = 'arrow'
  const imageArrow = document.createElement('img')
  imageArrow.src = 'assets/images/ic_arrow-down.svg'
  divArrow.appendChild(imageArrow)
  link.appendChild(divText)
  link.appendChild(divArrow)
  node.appendChild(link)
  return node
}

function formatDate(date) {
  const dateObject = new Date(date)
  const month = monthNames[dateObject.getMonth()]
  const day = String(dateObject.getDate()).padStart(2, '0')
  const year = dateObject.getFullYear()
  const output = `${day} ${month} ${year}`
  return output
}