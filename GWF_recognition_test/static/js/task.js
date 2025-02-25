var debug_mode = 0; // debug mode determines how long the blocks are, 5 sec in debug mode, 5 minutes in actual experiment
//var data_save_method = 'csv_server_py';
var data_save_method = 'csv_server_py';

// Will be set to true when experiment is exiting fullscreen normally, to prevent above end experiment code
var normal_exit = false;
var window_height = window.screen.height;


//this is to test if the user leave the webpage
var detectfocus=0
var isinfocus=1
document.addEventListener('mouseleave', e=>{
  detectfocus=detectfocus+1
  isinfocus=0
  //this is to see if user are focus or not
})
document.addEventListener('visibilitychange', e=>{
   if (document.visibilityState === 'visible') {
 //report that user is in focus
 isinfocus=1
  } else {
  detectfocus=detectfocus+1
  isinfocus=0
  //this is to see if user are focus or not
  }  
})

// Randomly generate an 8-character alphanumeric subject ID via jsPsych
var subject_id = jsPsych.randomization.randomID(8);

// Load PsiTurk
var psiturk = new PsiTurk(uniqueId, adServerLoc, mode);
var condition = psiturk.taskdata.get('condition') + 1; // they do zero-indexing

var timeline = []

//welcome page
var welcome = {
  type: 'survey-html-form',
  html: "<label for='worker_id'>Enter your Prolific Worker ID. Please make sure this is correct! </label><br><input type='text' id='worker_id' name='worker_id' required><br><br>",
  on_finish: function (data) {
    data.trial_type = "id_enter"
    window.useridtouse=data.responses
    window.useridtouse = useridtouse.split('"')[3];
    subject_id=useridtouse
  }
}
//welcome page end

//Instruction page
function createinstruct(instruct_1,number){
  var intro={
    type: 'html-keyboard-response',
    choices: ['space'],
    stimulus: instruct_1,
    on_finish: function (data) {
      data.trial_type = 'intro_'+number;
      data.stimulus='instruct'
    }
  }
  return intro
}

function createfulintro(instruct,instructnames){
  intro={}
for (let i = 0; i < instructnames.length; i++) {
  instructname=instructnames[i]
  intro[i] = createinstruct(instruct[instructname],i)
}return intro
}


intro_learn=createfulintro(instruct,instructnames)
intro_dir=createfulintro(dir_instruct,dir_instructnames)

timeline.push(welcome)
timelinepushintro(intro_learn,instructnames)


//Instruction page end


// learning phase

var warning_page={
  type: 'html-keyboard-response',
  choices: jsPsych.NO_KEYS,
  response_ends_trial: false,
  trial_duration:3000,
  stimulus: '<h1 style="color: red;">Please make sure to respond to the questions.</h1><br><h1 style="color: red;">Continued failure to respond will</h1><br><h1 style="color: red;">result in the task ending early</h1><br><h1 style="color: red;">The experiment will resume in 3 seconds</h1>',
  on_finish: function(data) {
    data.trial_type='warning_page'
    data.stimulus='warning'
    warning=warning+1
  }
}

let probe_num = NaN
let probe_name = NaN
function get_probe_num(){
  probe_num = Math.floor(Math.random()*5)+1
  return probe_num
} 
var probe_trial_num = null
function get_probe_trial() {
  probe_trial_num = Math.floor(Math.random()*15)
  probe_name = "familiar"
  if (probe_trial_num == 1) {
    probe_name = "familiar"
  } else if (probe_trial_num == 2) {
    probe_name = "unique"
  } else if (probe_trial_num == 3) {
    probe_name = "memorable"
  } return probe_name, probe_trial_num
}
get_probe_trial()
let trial_num = 0
function start_probe() {
  var probe_trial={
    type: 'html-keyboard-response',
      choices: ['1','2','3','4','5'],
      stimulus: `
        <div id="familiar" style="max-width: 1200px; margin: 100px auto; text-align: center;">
          <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${learn_img[trial_num]}' height='250'></style>
          <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
            Please press the ${get_probe_num()} option on your keyboard.
          </p>
          <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
            <br>
            <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
              <p>(1) Not at all ${probe_name}</p>
              <p>(2) Slightly ${probe_name}</p>
              <p>(3) Moderately ${probe_name}</p>
              <p>(4) Very ${probe_name}</p>
              <p>(5) Extremely ${probe_name}</p>
            </div><br><br>
          <strong>Press the number key that corresponds with what is said above.</strong>
          </p>
        </div>
      `,
      response_ends_trial: true,
      on_finish: function(data) {
        data.trial_type = 'familiar_rating';
        data.probe = data.key_press - 48
        if (probe_num == data.key_press - 48) {
          data.probe_accuracy = 1
        } else{
          data.probe_accuracy = 0
        }
      } 
  }
  timeline.push(probe_trial)
}


for (i=0;i<num_learn_trials;i++) {
  get_probe_trial()
  var learn_phase = {
    type: 'html-keyboard-responsefl',
    choices: jsPsych.NO_KEYS,
    response_ends_trial: false,
    stimulus:create_image_learn(learn_img,trial_num),
    stimulus_duration:3000,
    trial_duration:3000,
    on_finish: function(data) {
      data.trial_type = 'learn_phase';
      data.stimulus= learn_img[trial_num]
      data.image_type = shuffled_img_type[trial_num]
      sfa=1
    }
  }
  timeline.push(learn_phase)
  var familiarity = {
    type: 'html-keyboard-response',
    choices: ['1','2','3','4','5'],
    stimulus: `
      <div id="familiar" style="max-width: 1200px; margin: 100px auto; text-align: center;">
        <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${learn_img[trial_num]}' height='250'></style>
        <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
          How familiar is the image on a scale of 1 to 5?
        </p>
        <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
          <br>
          <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
            <p>(1) Not at all familiar</p>
            <p>(2) Slightly familiar</p>
            <p>(3) Moderately familiar</p>
            <p>(4) Very familiar</p>
            <p>(5) Extremely familiar</p>
          </div><br><br>
        <strong>Press the number key that corresponds with your rating.</strong>
        </p>
      </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
      data.trial_type = 'familiar_rating';
      data.rating = data.key_press - 48
    } 
  }
  timeline.push(familiarity);
  if (probe_trial_num == 1){
    start_probe()
  }
  var uniqueness = {
    type: 'html-keyboard-response',
    choices: ['1','2','3','4','5'],
    stimulus: `

      <div id="unique" style="max-width: 1200px; margin: 100px auto; text-align: center">  
        <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${learn_img[trial_num]}' height='250'></style>
        <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
          How unique is the image on a scale of 1 to 5?
        </p>
        <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
          <br>
          <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
            <p>(1) Not at all unique</p>
            <p>(2) Slightly unique</p>
            <p>(3) Moderately unique</p>
            <p>(4) Very unique</p>
            <p>(5) Extremely unique</p>
          </div><br><br>
        <strong>Press the number key that corresponds with your rating.</strong>
        </p>
      </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
      data.trial_type = 'unique_rating';
      data.rating = data.key_press - 48
    } 
  }
  timeline.push(uniqueness);
  if (probe_trial_num == 2){
    start_probe()
  }
  var memorability = {
    type: 'html-keyboard-response',
    choices: ['1','2','3','4','5'],
    stimulus: `
      <div id="memorable" style="max-width: 1200px; margin: 100px auto; text-align: center;">
        <img style='width: 250px;height: 250px;margin-bottom:100px' src='../static/images/${learn_img[trial_num]}' height='250'></style>
        <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
          How memorable is the image on a scale of 1 to 5?
        </p>
        <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
          <br>
          <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 28px; margin-top: 20px;">
            <p>(1) Not at all memorable</p>
            <p>(2) Slightly memorable</p>
            <p>(3) Moderately memorable</p>
            <p>(4) Very memorable</p>
            <p>(5) Extremely memorable</p>
          </div><br><br>
        <strong>Press the number key that corresponds with your rating.</strong>
        </p>
      </div>
    `,
    response_ends_trial: true,
    on_finish: function(data) {
      data.trial_type = 'memorable_rating';
      data.rating = data.key_press - 48
    } 
  }
  timeline.push(memorability);
  if (probe_trial_num == 3){
    start_probe()
  }
  let thebreak= {
    type: 'html-keyboard-response',
    choices:jsPsych.NO_KEYS,
    trial_duration: 400,
    stimulus:create_memory_ten(),
    on_finish: function(data) {
      data.trial_type='thebreak'
    }
  }
  timeline.push(thebreak);
  trial_num += 1
}

timelinepushintro(intro_dir,dir_instructnames)

let recog_trial_num = 0
let on_finish_num = 0
let correctResp = []

for (i=0;i<num_recognition_trials;i++){
  var img_recognition = {
    type: 'html-keyboard-response',
    choices: ['1','2'],
    response_ends_trial: true,
    stimulus:create_image_recognition(recognition_list,recog_trial_num),
    stimulus_duration:5000,//5 second for now, we will discuss it 
    trial_duration:5000,//5 second for now 
    on_finish: function(data) {
      data.trial_type = 'recognition_phase';
      data.stimulus= recognition_list[recog_trial_num]
      if (data.key_press == 49){
        data.response = "old"
      } else if (data.key_press == 50){
        data.response = "new"
      } else {
        data.response = "MISSED"
      }
      if(data.key_press == 49 && new_old[on_finish_num] == "OLD" || data.key_press == 50 && new_old[on_finish_num] == "NEW"){
        data.correct = 1
        correctResp.push(1)
        data.accuracy = correctResp / correctResp.length
      } else if (data.key_press == 49 && new_old[on_finish_num] == "NEW" || data.key_press == 50 && new_old[on_finish_num] == "OLD"){
        data.correct = 0 
        correctResp.push(0)
        data.accuracy = correctResp / correctResp.length
      } else {
        data.correct = NaN
        correctResp.push(0)
        data.accuracy = correctResp / correctResp.length
      }
      on_finish_num += 1
    }
  }
  recog_trial_num += 1
  timeline.push(img_recognition)
  var recog_confidence = {
    type: 'html-keyboard-response',
    choices: ['1','2','3','4'],
    response_ends_trial: true,
    stimulus:`
      <div id="confidence" style="max-width: 1000px; margin: 100px auto; text-align: center;">
        <p style="font-size: 32px; line-height: 1.6; font-weight: bold; margin-bottom: 20px;">
          How confident are you in your response?
        </p>
        <p style="font-size: 20px; line-height: 1.6; margin-bottom: 30px;">
          <br>
          <div class='test' style="display: flex; justify-content: space-around; align-items: center; text-align: center; width: 100%; font-size: 30px; margin-top: 20px;">
            <p>(1) Not at all confident</p>
            <p>(2) Slightly confident</p>
            <p>(3) Moderately confident</p>
            <p>(4) Very confident</p>
          </div><br><br>
        <strong>Press the number key that corresponds with your rating.</strong>
        </p>
      </div>
    `,
    stimulus_duration:5000,//5 second for now, we will discuss it 
    trial_duration:5000,//5 second for now 
    on_finish: function (data){
      data.trial_type = 'confidence';
      data.stimulus= recognition_list[recog_trial_num]
      data.confidence = data.key_press - 48
    }
  }
  timeline.push(recog_confidence);
}


// final thank you
var thank_you = {
  type: 'html-keyboard-response',
  choices: ['space'],
  stimulus: "<p> Congratulations, you are all done!</p><p>The secret code to enter at the beginning screen is: AJFHBG897</p><p> Please make sure to submit the HIT and email uciccnl@gmail.com if you had any issues! </p>",
  on_finish: function (data) {
    data.trial_type = 'thank_you';
    data.detectfocus = detectfocus;
    save_data(true)
  }
}

timeline.push(thank_you);

//time line here

jsPsych.init({
  timeline: timeline,
  preload_images: all_images,
  max_load_time: 600000,
  on_finish: function () {
    /* Retrieve the participant's data from jsPsych */
    // Determine and save participant bonus payment
    psiturk.recordUnstructuredData("subject_id", subject_id);
    save_data(true)
  },
})
