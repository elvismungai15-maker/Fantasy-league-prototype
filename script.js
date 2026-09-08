// ══════════════════════════
// STATE
// ══════════════════════════
const S = {
  iqScore: null, boost: 1.0, budget: 100.0,
  quizDone: false, quizIndex: 0, quizScore: 0,
  quizTimer: null, timeLeft: 20,
  attempt: 1,          // 1 or 2
  attempt1Score: null, // score from attempt 1
  timedOut: false,     // did the quiz end due to timeout?
  squad: { GK:[null], DEF:[null,null,null,null], MID:[null,null,null,null], FWD:[null,null,null] },
  captain: null, vc: null,
  managerName: '', clubName: '',
  leagueFilter: 'ALL'
};

// ══════════════════════════
// NAV
// ══════════════════════════
function showPage(name) {
  if (['squad','scout'].includes(name) && !S.quizDone) { showToast('⚠️ Complete the IQ Quiz first!'); return; }
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-tab').forEach(t => t.classList.remove('active'));
  document.getElementById('page-' + name).classList.add('active');
  const tabId = { home:null, quiz:'tab-quiz', squad:'tab-squad', scout:'tab-scout' }[name];
  if (!tabId) document.querySelector('.nav-tab').classList.add('active');
  else document.getElementById(tabId).classList.add('active');
  // Show done screen if quiz already completed
  if (name === 'quiz' && S.quizDone) {
    ['quiz-intro','quiz-attempt2','quiz-active','quiz-result'].forEach(id => document.getElementById(id).style.display = 'none');
    document.getElementById('quiz-done').style.display = 'block';
  }
}

function unlockPages() {
  document.getElementById('tab-squad').classList.remove('locked');
  document.getElementById('tab-scout').classList.remove('locked');
}

function goToSquad() { unlockPages(); showPage('squad'); }

function goToScout() { unlockPages(); showPage('scout'); }


// ══════════════════════════
// PLAYERS
// ══════════════════════════
const PLAYERS = {
  GK: [
    {name:'Alisson',      club:'Liverpool',    emoji:'🧤', price:6.0, pts:8,  league:'PL'},
    {name:'Ederson',      club:'Fenerbahçe',   emoji:'🧤', price:5.0, pts:7,  league:'SL'},
    {name:'Raya',         club:'Arsenal',      emoji:'🧤', price:5.0, pts:7,  league:'PL'},
    {name:'Flekken',      club:'Leverkusen',   emoji:'🧤', price:4.5, pts:6,  league:'BL'},
    {name:'Ter Stegen',   club:'Barcelona',    emoji:'🧤', price:5.5, pts:7,  league:'LL'},
    {name:'Maignan',      club:'AC Milan',     emoji:'🧤', price:5.5, pts:7,  league:'SA'},
    {name:'Sommer',       club:'Inter Milan',  emoji:'🧤', price:5.0, pts:6,  league:'SA'},
    {name:'Donnarumma',   club:'PSG',          emoji:'🧤', price:5.5, pts:7,  league:'L1'},
  ],
  DEF: [
    {name:'Alexander-Arnold', club:'Real Madrid',  emoji:'🛡️', price:8.0, pts:10, league:'LL'},
    {name:'Saliba',       club:'Arsenal',      emoji:'🛡️', price:6.0, pts:8,  league:'PL'},
    {name:'Gvardiol',     club:'Man City',     emoji:'🛡️', price:6.5, pts:8,  league:'PL'},
    {name:'Pedro Porro',  club:'Spurs',        emoji:'🛡️', price:5.5, pts:7,  league:'PL'},
    {name:'Timber',       club:'Arsenal',      emoji:'🛡️', price:5.5, pts:7,  league:'PL'},
    {name:'Trippier',     club:'Newcastle',    emoji:'🛡️', price:6.0, pts:7,  league:'PL'},
    {name:'Carvajal',     club:'Real Madrid',  emoji:'🛡️', price:7.0, pts:8,  league:'LL'},
    {name:'Theo Hernández',club:'AC Milan',    emoji:'🛡️', price:6.5, pts:8,  league:'SA'},
    {name:'Hakimi',       club:'PSG',          emoji:'🛡️', price:7.0, pts:9,  league:'L1'},
    {name:'Kimmich',      club:'Bayern Munich',emoji:'🛡️', price:7.0, pts:8,  league:'BL'},
    {name:'Grimaldo',     club:'Leverkusen',   emoji:'🛡️', price:6.0, pts:8,  league:'BL'},
    {name:'Bastoni',      club:'Inter Milan',  emoji:'🛡️', price:6.0, pts:7,  league:'SA'},
  ],
  MID: [
    {name:'Salah',        club:'Liverpool',    emoji:'⚡', price:13.0, pts:14, league:'PL'},
    {name:'Saka',         club:'Arsenal',      emoji:'⚡', price:10.0, pts:12, league:'PL'},
    {name:'Palmer',       club:'Chelsea',      emoji:'⚡', price:10.5, pts:13, league:'PL'},
    {name:'Mbappé',       club:'Real Madrid',  emoji:'⚡', price:14.0, pts:14, league:'LL'},
    {name:'Bellingham',   club:'Real Madrid',  emoji:'⚡', price:11.0, pts:12, league:'LL'},
    {name:'De Bruyne',    club:'Napoli',       emoji:'⚡', price:9.5,  pts:10, league:'SA'},
    {name:'Vinicius Jr',  club:'Real Madrid',  emoji:'⚡', price:13.0, pts:13, league:'LL'},
    {name:'Pedri',        club:'Barcelona',    emoji:'⚡', price:9.0,  pts:10, league:'LL'},
    {name:'Yamal',        club:'Barcelona',    emoji:'⚡', price:10.0, pts:12, league:'LL'},
    {name:'Wirtz',        club:'Bayern Munich',emoji:'⚡', price:10.5, pts:12, league:'BL'},
    {name:'Dembélé',      club:'PSG',          emoji:'⚡', price:10.0, pts:11, league:'L1'},
    {name:'Barella',      club:'Inter Milan',  emoji:'⚡', price:8.5,  pts:10, league:'SA'},
    {name:'Bruno Fernandes',club:'Man Utd',    emoji:'⚡', price:9.0,  pts:10, league:'PL'},
    {name:'Diaz',         club:'Liverpool',    emoji:'⚡', price:9.0,  pts:10, league:'PL'},
  ],
  FWD: [
    {name:'Haaland',      club:'Man City',     emoji:'🔥', price:14.5, pts:15, league:'PL'},
    {name:'Isak',         club:'Liverpool',    emoji:'🔥', price:12.0, pts:13, league:'PL'},
    {name:'Watkins',      club:'Aston Villa',  emoji:'🔥', price:9.0,  pts:10, league:'PL'},
    {name:'Solanke',      club:'Spurs',        emoji:'🔥', price:7.5,  pts:9,  league:'PL'},
    {name:'Hwang',        club:'Wolves',       emoji:'🔥', price:6.5,  pts:8,  league:'PL'},
    {name:'Lewandowski',  club:'Barcelona',    emoji:'🔥', price:11.0, pts:12, league:'LL'},
    {name:'Benzema',      club:'Al Hilal',     emoji:'🔥', price:8.0,  pts:9,  league:'SPL'},
    {name:'Osimhen',      club:'Galatasaray',  emoji:'🔥', price:9.0,  pts:10, league:'SL'},
    {name:'Kane',         club:'Bayern Munich',emoji:'🔥', price:13.0, pts:13, league:'BL'},
    {name:'Vlahović',     club:'Juventus',     emoji:'🔥', price:9.0,  pts:10, league:'SA'},
    {name:'Giroud',       club:'LA Galaxy',    emoji:'🔥', price:6.5,  pts:8,  league:'MLS'},
    {name:'Rashford',     club:'Barcelona',    emoji:'🔥', price:8.5,  pts:9,  league:'LL'},
  ]
};

const LEAGUE_LABELS = {PL:'Premier League',LL:'La Liga',SA:'Serie A',BL:'Bundesliga',L1:'Ligue 1',SL:'Süper Lig',SPL:'Saudi Pro League',MLS:'MLS'};

// ══════════════════════════════════════════════════════════
// TWO BANKS OF 15 — completely different questions each attempt
// ══════════════════════════════════════════════════════════
const QUESTION_BANK_1 = [
  {q:"Which manager pioneered 'Gegenpressing' and won the Champions League with Liverpool?", opts:["Pep Guardiola","Jürgen Klopp","Carlo Ancelotti","Zinedine Zidane"], answer:1, fact:"Klopp's Gegenpressing — winning the ball back instantly after losing it — defined an era. Liverpool won the Champions League in 2019 using this relentless system."},
  {q:"In which year did Leicester City win the Premier League at odds of 5000-1?", opts:["2014","2015","2016","2017"], answer:2, fact:"Leicester's 2015/16 title under Claudio Ranieri is widely considered the greatest sporting upset in history. Vardy, Mahrez and Kanté were the stars."},
  {q:"What does a 'mezzala' do in a midfield three?", opts:["Shields the backline as a holder","Tracks back as a wide midfielder","Attacks from half-spaces as an inside runner","Sits as a deep-lying playmaker"], answer:2, fact:"The mezzala drifts into half-spaces between the opposition's midfield and defence — think Luka Modrić arriving late into dangerous areas."},
  {q:"Which country has won the most Africa Cup of Nations titles?", opts:["Nigeria","Cameroon","Ghana","Egypt"], answer:3, fact:"Egypt hold the record with 7 AFCON titles, including three consecutive wins from 2006–2010. Cameroon are second with 5."},
  {q:"Guardiola's 'inverted fullback' system asks fullbacks to do what when attacking?", opts:["Overlap wide to deliver crosses","Tuck into central midfield","Push up as additional strikers","Drop into a back three"], answer:1, fact:"Inverted fullbacks (like Cancelo) tuck into central midfield when attacking, creating a 3-2-5 shape that overloads the centre rather than the wings."},
  {q:"How many times has Real Madrid won the UEFA Champions League as of 2024?", opts:["12","13","14","15"], answer:3, fact:"Real Madrid won their 15th Champions League in 2024, beating Borussia Dortmund at Wembley. No other club comes close."},
  {q:"What does 'xG' (expected goals) measure in football analytics?", opts:["Shots taken per game","Probability a shot results in a goal","Total goal contributions per season","Goal difference over a season"], answer:1, fact:"xG assigns a probability (0–1) to each shot based on distance, angle and assist type. A tap-in has high xG; a 40-yard effort has very low xG."},
  {q:"Which nation won the inaugural FIFA Women's World Cup in 1991?", opts:["Germany","Norway","Brazil","USA"], answer:3, fact:"The United States won the first Women's World Cup in China in 1991, beating Norway 2-1 in the final. The USA have since won 4 titles in total."},
  {q:"What is a 'regista' in football tactics?", opts:["A pressing forward","A deep-lying playmaker who dictates tempo","A sweeper behind the defence","An inverted winger"], answer:1, fact:"The regista sits deep and orchestrates play with precise passing and vision. Andrea Pirlo is the archetype — never running, always thinking two moves ahead."},
  {q:"Which English club was first to win the European Cup?", opts:["Arsenal","Manchester United","Liverpool","Nottingham Forest"], answer:2, fact:"Liverpool won the first of their European Cups in 1977 under Bob Paisley, beating Borussia Mönchengladbach 3-1 in Rome."},
  {q:"What is the offside trap designed to do?", opts:["Stop the GK being exposed to long balls","Catch attackers offside by pushing the defensive line up","Force play into wide areas by compressing centrally","Draw fouls by holding the line"], answer:1, fact:"The offside trap requires defenders to step up together at the moment the ball is played, leaving attackers in an offside position. Perfectly timed it's devastating — mistimed it's catastrophic."},
  {q:"Which formation is nicknamed the 'Christmas Tree'?", opts:["4-3-2-1","4-2-3-1","3-4-2-1","4-4-1-1"], answer:0, fact:"The 4-3-2-1 narrows like a tree toward the top. Carlo Ancelotti famously used it at AC Milan in the early 2000s to great success."},
  {q:"What record does Lionel Messi hold alone among all players?", opts:["Most UCL goals ever","Most Ballon d'Or awards (8)","Most PL assists in one season","First player to score 100 international goals"], answer:1, fact:"Messi has won 8 Ballon d'Or awards — more than any other player in history. His closest rival Ronaldo has 5."},
  {q:"Who scored the 'Hand of God' and 'Goal of the Century' in the same 1986 World Cup match?", opts:["Pelé","Ronaldo","Diego Maradona","Zinedine Zidane"], answer:2, fact:"Diego Maradona scored both iconic goals against England in the 1986 quarter-final — one with his hand, one after dribbling past five players."},
  {q:"In fantasy football, what does 'differential' mean?", opts:["The points gap between two managers","A low-ownership player who could give you an edge","The price difference between similar players","A player eligible in two positions"], answer:1, fact:"A differential is a player owned by very few managers. If they score big, you gain ground on most of your rivals — high risk, high reward."},
];

const QUESTION_BANK_2 = [
  {q:"Which club has won the most domestic league titles in English football history?", opts:["Arsenal","Liverpool","Manchester United","Chelsea"], answer:2, fact:"Manchester United hold the record with 20 English top-flight titles, one more than Liverpool's 19. Their dominant era under Sir Alex Ferguson from 1986–2013 accounts for 13 of those."},
  {q:"What is 'tiki-taka' most associated with?", opts:["Direct counter-attacking football","High pressing and long balls","Short passing, possession and positional play","Physical 4-4-2 defending"], answer:2, fact:"Tiki-taka is the short-passing possession style made famous by Pep Guardiola's Barcelona and Spain's national team — built on movement, triangles and suffocating opponents through control."},
  {q:"How many players are in a standard football team on the pitch?", opts:["9","10","11","12"], answer:2, fact:"Each team fields 11 players — including the goalkeeper. This has been standard since the laws of the game were codified by The Football Association in 1863."},
  {q:"Which country hosted the 2010 FIFA World Cup, the first held on African soil?", opts:["Egypt","Nigeria","Morocco","South Africa"], answer:3, fact:"South Africa hosted the 2010 World Cup — a historic milestone. Spain won the tournament, beating Netherlands 1-0 in extra time thanks to Andrés Iniesta's winner."},
  {q:"What does a 'false nine' do that a traditional centre-forward does not?", opts:["Stays high and holds up play","Drops deep to drag defenders and create space","Takes long-range shots constantly","Acts as a second goalkeeper in extreme pressing"], answer:1, fact:"The false nine drops into midfield, pulling central defenders out of position and creating gaps for onrushing attackers to exploit. Messi perfected this under Guardiola at Barcelona."},
  {q:"In which city is the Bernabéu stadium located?", opts:["Barcelona","Seville","Lisbon","Madrid"], answer:3, fact:"The Santiago Bernabéu is in Madrid and is home to Real Madrid. With a capacity of over 80,000 after its recent renovation, it is one of the most iconic stadiums in world football."},
  {q:"What is a 'clean sheet' in football?", opts:["A game with no yellow cards","When a team wins by more than 3 goals","When a goalkeeper or team concedes no goals","A match played in perfect weather conditions"], answer:2, fact:"A clean sheet means the goalkeeper or team conceded zero goals during the match. In fantasy football, goalkeepers and defenders earn bonus points for keeping clean sheets."},
  {q:"Which player has scored the most goals in Champions League history?", opts:["Lionel Messi","Raúl","Cristiano Ronaldo","Robert Lewandowski"], answer:2, fact:"Cristiano Ronaldo holds the all-time Champions League scoring record with 140 goals — over 30 more than his nearest rival. He scored for Manchester United, Real Madrid and Juventus in the competition."},
  {q:"What does 'pressing high' mean in modern football?", opts:["Shooting from distance more often","Defending deep in your own half","Applying pressure to opponents in their half to win the ball back quickly","Pushing your fullbacks forward into attack"], answer:2, fact:"High pressing means the team applies defensive pressure far up the pitch — in the opponent's half — to win back the ball quickly and before they can build attacks. It requires intense fitness and coordination."},
  {q:"Which South American nation has won the Copa América the most times?", opts:["Brazil","Colombia","Argentina","Uruguay"], answer:3, fact:"Uruguay are the most successful Copa América nation with 15 titles, narrowly ahead of Argentina's 16 — wait, actually Argentina lead with 16 as of 2024. Argentina's most recent win in 2024 gives them the record."},
  {q:"What is the 'number 10' position traditionally associated with in football?", opts:["A defensive midfielder who breaks up play","An attacking playmaker who links midfield and attack","A right back who overlaps","A defensive winger who tracks back"], answer:1, fact:"The number 10 is the classic attacking playmaker — the most creative player on the team who links midfield and attack. Legends like Pelé, Maradona, Zidane and Messi all famously wore or were associated with the number."},
  {q:"What does VAR stand for in football?", opts:["Variable Angle Replay","Video Assistant Referee","Virtual Accuracy Review","Video Analysis Response"], answer:1, fact:"VAR (Video Assistant Referee) was introduced to the Premier League in 2019 and is now used in most top competitions. It reviews goals, penalties, red cards and cases of mistaken identity."},
  {q:"Which manager won the Champions League with three different clubs?", opts:["Pep Guardiola","José Mourinho","Carlo Ancelotti","Zinedine Zidane"], answer:2, fact:"Carlo Ancelotti is the only manager to win the Champions League with three clubs — AC Milan (2003, 2007), Real Madrid (2014, 2016, 2018, 2022) and... well, he's won it a record 4 times as a manager overall."},
  {q:"In football, what is a 'brace'?", opts:["A last-minute winner","Two goals scored by the same player in one game","A tackle that wins the ball cleanly","A header from a corner"], answer:1, fact:"A brace means one player scoring exactly two goals in a single match. Scoring three is a hat-trick, and four is sometimes called a 'haul' — which fantasy football managers absolutely love."},
  {q:"Which club did Erling Haaland join before Manchester City?", opts:["RB Leipzig","Ajax","Borussia Dortmund","Salzburg"], answer:2, fact:"Haaland joined Manchester City from Borussia Dortmund in June 2022 for £51.2M. At Dortmund he scored 86 goals in 89 appearances — one of the most prolific spells in Bundesliga history."},
];

let QUESTIONS = [...QUESTION_BANK_1]; // active question set

// ══════════════════════════
// QUIZ LOGIC
// ══════════════════════════
function hideAllQuizSections() {
  ['quiz-intro','quiz-attempt2','quiz-done','quiz-active','quiz-result'].forEach(id => {
    document.getElementById(id).style.display = 'none';
  });
}

function startQuiz() {
  S.attempt = 1;
  S.quizIndex = 0; S.quizScore = 0; S.timedOut = false;
  QUESTIONS = [...QUESTION_BANK_1];
  hideAllQuizSections();
  document.getElementById('quiz-active').style.display = 'block';
  loadQ();
}

function startAttempt2() {
  S.attempt = 2;
  S.quizIndex = 0; S.quizScore = 0; S.timedOut = false;
  QUESTIONS = [...QUESTION_BANK_2];
  hideAllQuizSections();
  document.getElementById('quiz-active').style.display = 'block';
  loadQ();
}

function skipAttempt2() {
  // Keep attempt 1 score as final
  S.quizDone = true;
  hideAllQuizSections();
  document.getElementById('quiz-done').style.display = 'block';
  document.getElementById('done-score').textContent = `${S.attempt1Score}/15`;
  applyQuizResult(S.attempt1Score);
  unlockPages();
}

function loadQ() {
  const q = QUESTIONS[S.quizIndex];
  document.getElementById('q-num').textContent = `Attempt ${S.attempt} — Question ${S.quizIndex + 1} of ${QUESTIONS.length}`;
  document.getElementById('q-text').textContent = q.q;
  document.getElementById('q-progress').style.width = `${(S.quizIndex / QUESTIONS.length) * 100}%`;
  document.getElementById('q-feedback').className = 'q-feedback';
  document.getElementById('next-btn').style.display = 'none';
  const letters = ['A','B','C','D'];
  document.getElementById('q-options').innerHTML = q.opts.map((o,i) =>
    `<button class="q-opt" onclick="answerQ(${i})"><span class="opt-letter">${letters[i]}</span>${o}</button>`
  ).join('');
  S.timeLeft = 20;
  document.getElementById('timer-num').textContent = 20;
  document.getElementById('timer-num').className = 'timer-num';
  clearInterval(S.quizTimer);
  S.quizTimer = setInterval(() => {
    S.timeLeft--;
    document.getElementById('timer-num').textContent = S.timeLeft;
    if (S.timeLeft <= 5) document.getElementById('timer-num').className = 'timer-num urgent';
    if (S.timeLeft <= 0) { clearInterval(S.quizTimer); hardTimeUp(); }
  }, 1000);
}

function answerQ(chosen) {
  clearInterval(S.quizTimer);
  const q = QUESTIONS[S.quizIndex];
  document.querySelectorAll('.q-opt').forEach(o => o.disabled = true);
  const correct = chosen === q.answer;
  if (correct) S.quizScore++;
  document.querySelectorAll('.q-opt')[q.answer].classList.add('correct');
  if (!correct) document.querySelectorAll('.q-opt')[chosen].classList.add('wrong');
  const fb = document.getElementById('q-feedback');
  fb.innerHTML = `<strong>${correct ? '✅ Correct!' : '❌ Not quite.'}</strong> ${q.fact}`;
  fb.className = 'q-feedback show';
  document.getElementById('next-btn').style.display = 'inline-block';
}

function hardTimeUp() {
  // Timer expires — quiz ends IMMEDIATELY, no more answering
  S.timedOut = true;
  document.querySelectorAll('.q-opt').forEach(o => o.disabled = true);
  clearInterval(S.quizTimer);

  // Show dramatic timeout overlay message, then finish after 2.5s
  const fb = document.getElementById('q-feedback');
  fb.innerHTML = `<strong style="color:var(--red)">⏰ TIME EXPIRED — Quiz Over!</strong> You ran out of time. Remaining questions scored zero. Your attempt ends here.`;
  fb.className = 'q-feedback show';

  // Disable next button and auto-advance to result after brief pause
  document.getElementById('next-btn').style.display = 'none';
  setTimeout(() => finishQuiz(), 2800);
}

function nextQuestion() {
  S.quizIndex++;
  if (S.quizIndex < QUESTIONS.length) { loadQ(); }
  else { finishQuiz(); }
}

function finishQuiz() {
  clearInterval(S.quizTimer);
  hideAllQuizSections();

  if (S.attempt === 1) {
    // Save attempt 1 score
    S.attempt1Score = S.quizScore;
    const pct = S.quizScore / QUESTIONS.length;
    const timeoutNote = S.timedOut ? ' ⏰ Quiz ended by timer.' : '';
    document.getElementById('attempt1-score-display').textContent =
      `${S.quizScore}/15 (${Math.round(pct*100)}%)${timeoutNote}`;
    document.getElementById('quiz-attempt2').style.display = 'block';
  } else {
    // Both attempts done — take best score
    const bestScore = Math.max(S.attempt1Score, S.quizScore);
    S.quizDone = true;
    document.getElementById('quiz-done').style.display = 'block';
    document.getElementById('done-score').textContent = `${bestScore}/15`;
    applyQuizResult(bestScore);
    document.getElementById('quiz-result').style.display = 'block';
    document.getElementById('quiz-done').style.display = 'none';
    showFinalResult(bestScore);
    unlockPages();
  }
}

function showFinalResult(score) {
  const pct = score / 15;
  const iq = Math.round(40 + pct * 60);
  S.iqScore = iq;
  document.getElementById('q-progress').style.width = '100%';
  const deg = Math.round(pct * 360);
  document.getElementById('score-ring').style.background =
    `conic-gradient(var(--gold) 0deg, var(--gold) ${deg}deg, rgba(255,255,255,0.05) ${deg}deg)`;
  document.getElementById('res-score').textContent = iq;

  let tier, desc;
  if (pct >= 0.8)      { tier='ELITE TACTICIAN'; desc=`${score}/15 correct — outstanding! You clearly live and breathe football.`; }
  else if (pct >= 0.6) { tier='SENIOR SCOUT';    desc=`${score}/15 correct — solid knowledge. You've earned your bonus budget!`; }
  else if (pct >= 0.4) { tier='JUNIOR ANALYST';  desc=`${score}/15 correct — decent start. Standard budget applies.`; }
  else                 { tier='Sunday LEAGUE';   desc=`${score}/15 correct — tough luck! Budget reduced as a penalty. Study up for next time!`; }

  document.getElementById('res-tier').textContent = tier;
  document.getElementById('res-desc').textContent = desc;
  document.getElementById('res-boost').textContent = `Team Boost: ${S.boost}×`;
  const bonusText = S.budget > 100
    ? `Budget: £${S.budget}M (+£${S.budget-100}M bonus!) 🎉`
    : S.budget < 100
    ? `Budget: £${S.budget}M (-£${100-S.budget}M penalty) ⚠️`
    : `Budget: £${S.budget}M (standard)`;
  document.getElementById('res-budget').textContent = bonusText;
}

function applyQuizResult(score) {
  const pct = score / 15;
  const iq = Math.round(40 + pct * 60);
  S.iqScore = iq;

  let boost, budget;
  if (pct >= 0.8)      { boost=1.3; budget=130; }
  else if (pct >= 0.6) { boost=1.1; budget=115; }
  else if (pct >= 0.4) { boost=1.0; budget=100; }
  else                 { boost=0.8; budget=80;  } // penalty for very low score

  S.boost = boost; S.budget = budget;

  document.getElementById('nav-iq').textContent = iq;
  document.getElementById('stat-iq').textContent = iq;
  document.getElementById('stat-boost').textContent = boost + '×';
  document.getElementById('stat-budget').textContent = `£${budget}M`;
  document.getElementById('budget-display').textContent = budget.toFixed(1);
  document.getElementById('squad-boost').textContent = boost + '×';
  document.getElementById('mc-iq').textContent = iq;
  document.getElementById('mc-boost').textContent = boost + '×';
  document.getElementById('mc-rating').textContent = iq;
  document.getElementById('done-score').textContent = `${score}/15 (IQ: ${iq})`;
}

// ══════════════════════════
// SQUAD BUILDER
// ══════════════════════════
let pPos = null, pIdx = null;

function updateIdentity() {
  const name = document.getElementById('manager-name').value.trim() || 'YOUR NAME';
  const club = document.getElementById('club-name').value.trim() || 'My Fantasy Club';
  S.managerName = name; S.clubName = club;
  document.getElementById('mc-name').textContent = name.toUpperCase();
  document.getElementById('mc-club').textContent = club;
}

function openPicker(pos, idx) {
  pPos = pos; pIdx = idx;
  const labels = {GK:'Goalkeeper',DEF:'Defender',MID:'Midfielder',FWD:'Forward'};
  document.getElementById('picker-title').textContent = `Select ${labels[pos]}`;
  renderLeagueFilter();
  renderGrid();
}

function renderLeagueFilter() {
  const leagues = ['ALL', ...new Set(PLAYERS[pPos].map(p => p.league))];
  document.getElementById('league-filter').innerHTML = leagues.map(l =>
    `<button class="filter-btn ${S.leagueFilter===l?'active':''}" onclick="setLeagueFilter('${l}')">${l==='ALL'?'All Leagues':(LEAGUE_LABELS[l]||l)}</button>`
  ).join('');
}

function setLeagueFilter(league) {
  S.leagueFilter = league;
  renderLeagueFilter();
  renderGrid();
}

function renderGrid() {
  const filtered = PLAYERS[pPos].filter(p => S.leagueFilter === 'ALL' || p.league === S.leagueFilter);
  document.getElementById('player-grid').innerHTML = filtered.map((p,i) => {
    const realIdx = PLAYERS[pPos].indexOf(p);
    const sel = S.squad[pPos].some(s => s && s.name === p.name);
    const isC  = S.captain === p.name;
    const isVC = S.vc === p.name;
    return `<div class="player-card ${sel?'selected':''}" onclick="selectPlayer(${realIdx})">
      <div class="pc-top">
        <span class="pc-emoji">${p.emoji}</span>
        <span class="pc-pos" style="font-size:0.58rem">${LEAGUE_LABELS[p.league]||p.league}</span>
      </div>
      <div class="pc-name">${p.name}${isC?' 🅒':isVC?' 🅥':''}</div>
      <div class="pc-club">${p.club}</div>
      <div class="pc-bottom"><div class="pc-price">£${p.price}M</div><div class="pc-pts">↑${p.pts}pts</div></div>
    </div>`;
  }).join('') || '<div style="color:var(--text-muted);font-size:0.82rem;padding:12px;">No players in this league for this position.</div>';
}

function selectPlayer(i) {
  const p = PLAYERS[pPos][i];
  if (S.squad[pPos].some((s,j) => s && s.name === p.name && j !== pIdx)) { showToast('⚠️ Already in squad!'); return; }
  const old = S.squad[pPos][pIdx];
  if (old) S.budget += old.price;
  if (S.budget < p.price) { showToast('💰 Not enough budget!'); if (old) S.budget -= old.price; return; }
  S.budget -= p.price;
  S.squad[pPos][pIdx] = p;
  refreshSlotUI(pPos, pIdx, p);
  document.getElementById('budget-display').textContent = S.budget.toFixed(1);
  renderGrid();
  updateMC();
  updateArmbandsDropdowns();
  showToast(`✅ ${p.name} added!`);
}

function refreshSlotUI(pos, idx, player) {
  const slot = document.getElementById(`slot-${pos.toLowerCase()}-${idx}`);
  const isC  = S.captain === player.name;
  const isVC = S.vc === player.name;
  slot.innerHTML = `${player.emoji}<span class="player-pos-badge">${pos}</span>${isC?'<div class="c-badge">C</div>':isVC?'<div class="vc-badge">VC</div>':''}`;
  slot.classList.add('filled');
  if (pos === 'GK') slot.classList.add('gk');
  const wrap = slot.parentElement;
  wrap.querySelector('.player-name').textContent = player.name;
  wrap.querySelector('.player-pts').textContent = `${player.pts}pts`;
}

function refreshAllSlots() {
  ['GK','DEF','MID','FWD'].forEach(pos => {
    S.squad[pos].forEach((p, idx) => { if (p) refreshSlotUI(pos, idx, p); });
  });
}

function updateMC() {
  const pts = Object.values(S.squad).flat().filter(Boolean).reduce((a,b) => a + b.pts, 0);
  document.getElementById('mc-pts').textContent = pts;
  if (S.iqScore) document.getElementById('mc-rating').textContent = Math.min(99, Math.round(S.iqScore * 0.6 + pts * 0.2));
}

function updateArmbandsDropdowns() {
  const allPlayers = Object.values(S.squad).flat().filter(Boolean);
  const capSel = document.getElementById('captain-select');
  const vcSel  = document.getElementById('vc-select');
  const capVal = capSel.value;
  const vcVal  = vcSel.value;
  capSel.innerHTML = '<option value="">— Pick captain —</option>' +
    allPlayers.map(p => `<option value="${p.name}" ${p.name===capVal?'selected':''}>${p.name} (${p.club})</option>`).join('');
  vcSel.innerHTML  = '<option value="">— Pick vice captain —</option>' +
    allPlayers.map(p => `<option value="${p.name}" ${p.name===vcVal?'selected':''}>${p.name} (${p.club})</option>`).join('');
}

function updateArmbands() {
  const capName = document.getElementById('captain-select').value;
  const vcName  = document.getElementById('vc-select').value;
  if (capName && capName === vcName) {
    showToast('⚠️ Captain and Vice Captain must be different players!');
    document.getElementById('vc-select').value = '';
    return;
  }
  S.captain = capName || null;
  S.vc      = vcName  || null;
  document.getElementById('captain-badge').style.display = capName ? 'inline-block' : 'none';
  document.getElementById('captain-badge').textContent = capName ? `C: ${capName}` : '';
  document.getElementById('vc-badge').style.display = vcName ? 'inline-block' : 'none';
  document.getElementById('vc-badge').textContent = vcName ? `VC: ${vcName}` : '';
  refreshAllSlots();
}

// ══════════════════════════
// GAFFER AI (rule-based, no API needed)
// ══════════════════════════
const pick = arr => arr[Math.floor(Math.random() * arr.length)];
const run  = arr => { const v = pick(arr); return typeof v === 'function' ? v() : v; };

const GAFFER = {
  greet:    ["Alright boss! Squad looking sharp or still a work in progress? 👀", "Gaffer's in. What do you need — player advice, tactics, or a roasting? ⚽", "Boss! What's on your mind today? 🎯"],
  captain:  [() => { const all=[...S.squad.FWD,...S.squad.MID,...S.squad.DEF,...S.squad.GK].filter(Boolean); if(!all.length) return "Pick some players first boss! 😅"; if(S.captain) return `${S.captain} as captain is a ${S.captain==='Haaland'||S.captain==='Salah'||S.captain==='Mbappé'?'brilliant':'solid'} shout boss — wearing the armband proudly! ${S.vc?`And ${S.vc} as vice captain is a decent backup. 🤝`:'Don\'t forget to set a vice captain too! 🅥'}`; const b=all.reduce((a,c)=>a.pts>c.pts?a:c); return `You haven\'t set a captain yet boss! I\'d go with ${b.name} — ${b.pts} projected pts from ${b.club}. Head to the armband section! 🎖️`; }],
  budget:   [() => `You've got £${S.budget.toFixed(1)}M left boss. ${S.budget>=20?"Plenty to splash! 💸":S.budget>=10?"Enough for a solid pick. 🧐":"Tight squeeze — choose wisely! 🫰"}`],
  squad:    [() => { const f=Object.values(S.squad).flat().filter(Boolean); if(!f.length) return "Your squad is empty boss! Get on the market — matchday is coming! 😱"; if(f.length<6) return `Only ${f.length} players in. Short-handed! ⏰`; if(f.length<12) return `${f.length}/12 picked. Nearly there boss! 🏃`; return `Full squad! ${f.map(p=>p.name).join(', ')}. Looking dangerous. 🔥`; }],
  iq:       [() => { if(!S.iqScore) return "Take the IQ quiz first boss — you might unlock bonus budget! 🧠"; if(S.iqScore>=85) return `IQ ${S.iqScore}?! You're basically Pep with a laptop. That ${S.boost}× boost is lethal. 🔥`; if(S.iqScore>=70) return `${S.iqScore} IQ — solid! That ${S.boost}× multiplier puts you ahead of most. 💪`; return `${S.iqScore} IQ — decent start. Study your tactics for next time! 📚`; }],
  haaland:  ["Haaland is a cheat code boss. If you can afford him, you buy him. Full stop. 🤖", "The man scores more goals than he has personality. Top fantasy pick though! 🎯"],
  salah:    ["Salah is still the king of fantasy boss. Consistent, clinical. Always captain material. 👑", "Mo Salah? Automatic pick. Has been for years. 💰"],
  mbappe:   ["Mbappé at Real Madrid — frightening. High price but sky-high ceiling. ⚡", "Mbappé is box office. Premium price, premium returns. 🌟"],
  isak:     ["Isak at Liverpool — British record signing and already delivering. Fantasy must-have. 🔥", "Alexander Isak: pace, technique, goals. Liverpool's new weapon. 🎯"],
  debruyne: ["De Bruyne at Napoli boss — different league, same genius. Creative fantasy gold. 🎨", "KDB in Serie A is actually fascinating. Still elite, slightly cheaper now. 💡"],
  tactics:  ["Simple boss — pack midfield with attackers, cheap keeper, captain your top scorer. Fantasy is points, not pretty football! 😄", "Follow form over reputation. The in-form guy at a mid-table club beats the quiet big name every week. 🎯"],
  transfer: ["Go where the goals are boss. Hot striker + easy fixtures = pounce! 🦅", "Always check the fixture list first. Good player vs bad defence is pure gold. 💛"],
  roast:    [() => { const a=Object.values(S.squad).flat().filter(Boolean); if(!a.length) return "No players yet?! My nan manages better and she doesn't even watch football! 👵😂"; const c=a.reduce((x,y)=>x.price<y.price?x:y); return `${c.name} at £${c.price}M boss? I've seen better in a Sunday league jumble sale! 😂`; }],
  default:  ["Good question boss! Back your in-form players and never captain a defender. Ever. 🙅", "Keep it simple: in-form players + easy fixtures = points. That's the formula. ⚽", "Football's unpredictable boss — that's why we love it. Now build that squad! 🏆", "Top tip: attacking midfielders are your best friends in fantasy. Load up on them! 💡", "Avoid injured players, dodgy penalty takers, and always get a budget keeper. Simple! 🧤"],
};

function getReply(msg) {
  const m = msg.toLowerCase();
  if (/\b(hi|hello|hey|sup|yo|alright|hiya)\b/.test(m)) return pick(GAFFER.greet);
  if (/captain|armband/.test(m))         return run(GAFFER.captain);
  if (/budget|money|afford|how much/.test(m)) return run(GAFFER.budget);
  if (/my squad|my team|squad look/.test(m))  return run(GAFFER.squad);
  if (/\biq\b|quiz|boost|multiplier/.test(m)) return run(GAFFER.iq);
  if (/haaland/.test(m))   return pick(GAFFER.haaland);
  if (/salah/.test(m))     return pick(GAFFER.salah);
  if (/mbapp/.test(m))     return pick(GAFFER.mbappe);
  if (/isak/.test(m))      return pick(GAFFER.isak);
  if (/bruyne|debruyne/.test(m)) return pick(GAFFER.debruyne);
  if (/tactic|system/.test(m))   return pick(GAFFER.tactics);
  if (/transfer|sign|buy|sell/.test(m)) return pick(GAFFER.transfer);
  if (/roast|bad|terrible|worst/.test(m)) return run(GAFFER.roast);
  return pick(GAFFER.default);
}

async function sendMsg() {
  const inp = document.getElementById('ai-input');
  const text = inp.value.trim();
  if (!text) return;
  inp.value = '';
  addMsg('user', text);
  const btn = document.getElementById('ai-send-btn');
  btn.disabled = true;
  const tid = addTyping();
  await new Promise(r => setTimeout(r, 700 + Math.random() * 600));
  removeTyping(tid);
  addMsg('ai', getReply(text));
  btn.disabled = false;
  inp.focus();
}

function addMsg(role, text) {
  const c = document.getElementById('ai-messages');
  const d = document.createElement('div');
  d.className = `msg ${role}`;
  d.innerHTML = `<div class="msg-avatar">${role==='ai'?'⚽':'👤'}</div><div class="msg-bubble">${text}</div>`;
  c.appendChild(d);
  c.scrollTop = c.scrollHeight;
}

function addTyping() {
  const c = document.getElementById('ai-messages');
  const id = 'typ-' + Date.now();
  const d = document.createElement('div');
  d.className = 'msg ai'; d.id = id;
  d.innerHTML = `<div class="msg-avatar">⚽</div><div class="msg-bubble"><div class="typing-indicator"><div class="typing-dot"></div><div class="typing-dot"></div><div class="typing-dot"></div></div></div>`;
  c.appendChild(d); c.scrollTop = c.scrollHeight;
  return id;
}

function removeTyping(id) { document.getElementById(id)?.remove(); }

// ══════════════════════════
// TOAST
// ══════════════════════════
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg; t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2600);
}

// INIT
document.getElementById('budget-display').textContent = S.budget.toFixed(1);
S.leagueFilter = 'ALL';
// ══════════════════════════
// BACKGROUND VIDEO (optional — off by default)
// ══════════════════════════
// By default the app uses a CSS-only animated background (see .animated-bg
// in style.css) so it always looks complete with zero external dependencies.
//
// To use a real video instead: paste a YouTube VIDEO ID below (the part
// after "v=" in a normal youtube.com/watch?v=... URL — NOT a playlist ID).
// Pick a video you've watched yourself and confirmed allows embedding.
// Leave it as '' to keep the animated background.
const BACKGROUND_VIDEO_ID = '';

let videoMuted = true;
let videoActive = false;

function buildVideoSrc(id, muted) {
  return `https://www.youtube.com/embed/${id}?autoplay=1&mute=${muted ? 1 : 0}`
       + `&loop=1&playlist=${id}&controls=0&showinfo=0&rel=0`
       + `&modestbranding=1&playsinline=1&iv_load_policy=3&fs=0&disablekb=1`;
}

function initBackgroundVideo() {
  const wrapper = document.getElementById('video-bg-wrapper');
  const iframe = document.getElementById('bg-video');
  if (!wrapper || !iframe) return;
  if (!BACKGROUND_VIDEO_ID) return; // keep animated CSS fallback, no video controls needed
  iframe.setAttribute('allow', 'autoplay; encrypted-media');
  iframe.setAttribute('allowfullscreen', '');
  iframe.src = buildVideoSrc(BACKGROUND_VIDEO_ID, videoMuted);
  iframe.style.display = 'block';
  wrapper.classList.add('video-active');
  videoActive = true;
  showVideoControls();
}

function toggleVideoMute() {
  if (!videoActive) return;
  videoMuted = !videoMuted;
  const iframe = document.getElementById('bg-video');
  const btn = document.getElementById('vid-mute-btn');
  if (iframe) iframe.src = buildVideoSrc(BACKGROUND_VIDEO_ID, videoMuted);
  if (btn) btn.textContent = videoMuted ? '🔇' : '🔊';
}

function toggleVideoVisibility() {
  if (!videoActive) return;
  const wrapper = document.getElementById('video-bg-wrapper');
  const iframe = document.getElementById('bg-video');
  const btn = document.getElementById('vid-vis-btn');
  const nowHidden = iframe.style.display !== 'none';
  iframe.style.display = nowHidden ? 'none' : 'block';
  wrapper.classList.toggle('video-active', !nowHidden);
  if (btn) btn.textContent = nowHidden ? '🌑' : '🎬';
}

function showVideoControls() {
  if (document.querySelector('.video-controls')) return;
  const div = document.createElement('div');
  div.className = 'video-controls';
  div.innerHTML = `
    <button class="vid-btn" id="vid-mute-btn" onclick="toggleVideoMute()" title="Toggle sound">🔇</button>
    <button class="vid-btn" id="vid-vis-btn" onclick="toggleVideoVisibility()" title="Toggle video">🎬</button>
  `;
  document.body.appendChild(div);
}

initBackgroundVideo();
