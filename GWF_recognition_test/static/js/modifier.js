//debug moode on/off
debugmode= true
if (debugmode==false){
  num_learn_trials = 5
  num_recognition_trials = 5
}else{
  num_learn_trials = 25
  num_recognition_trials = 50
}
n_learning_trial=3 //This determine the number of learning trial you want in total
n_direct_trial=10 //how many direct trial you want
n_shortest_trial=10 //how many shortest path you want
n_goaldir_trial=10 //how many goal directed planning you want
//warningpage
warning=0 //this is to start the counter of total warning
warning_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5;color:red'>Warning, you are missing too many trials, make sure to press the key '1' when you see a blue cross flash and '2' when you see a green one. If you keep missing trials you will be disqualified.</p>",
checkfail=0 //this is to start the attentioncheck
checkthreshold=2 //this is to add the threshold for attentioncheck

//Text for instruction
instruct_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 55px;margin-bottom:40px'><b>Welcome!</b></p><p style ='font-size: 50px;line-height:1.5'>You are tasked with learning different city images.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>While learning these images, you will grade them based on how familiar, unique, and memorable they are.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_3="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>For example, you will first be presented with an image like the one below for 3 seconds.</p><br /><img src= '../static/images/img_manmade_30.png' width='200' height='200'></img><br /><br><p style ='font-size: 50px;line-height:1.5'>During this time, your job is to try to remember the image to the best of your ability.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_4="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>Then, the image will disappear and you will be asked to rate the image on a scale of 1-5 on how familiar, unique, and memorable they are. You will use your keyboard to press the number corresponding with your rating.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_5="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>After all the images are presented, you will see a list of images containing both the old images you studied and new ones as well. You will choose whether the image is new or old, so try to memorize the images to the best of your ability.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",


instructnames = ["instruct_1","instruct_2","instruct_3","instruct_4","instruct_5"]// IF you want to add or decrease number of page for instruct, just delete or add var name here.
instruct={instruct_1,instruct_2,instruct_3,instruct_4,instruct_5} // IF you want to add or decrease number of page for instruct, just delete or add var here.


//Text for direct memory instruction
instruct_dir_1="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>Now that you have studied the various city images, we will test you on your memory of them.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_2="<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>On each trial, you will be presented with a city image that will either be one of the previous cities you studied or a new image.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_3 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>If the image is <strong>OLD</strong> (from the previous list) press '1'. If it is <strong>NEW</strong> press '2'.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to continue]</p>",
instruct_dir_4 = "<div style='margin-left:200px ;margin-right: 200px ;text-justify: auto'><p style ='font-size: 50px;line-height:1.5'>You will only have a couple of seconds to respond to every trial, so try to respond as quickly and as accurately as possible.</p><p style= 'font-size:25px;margin-top:100px'>[press the spacebar to start]</p>",
dir_instructnames = ["instruct_dir_1","instruct_dir_2","instruct_dir_3","instruct_dir_4"] //Same for above, if you want to delete or add, just decrease or add the var
dir_instruct={instruct_dir_1,instruct_dir_2,instruct_dir_3,instruct_dir_4} //same for above

//learning phase

function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

let img_mm_list = []
let unshuffled_img_type = []

for (i=1;i<26;i++){
  if (i<10){
    img_mm_list.push(`img_manmade_0${i}.png`)
    unshuffled_img_type.push("MM")
  } else {
    img_mm_list.push(`img_manmade_${i}.png`)
    unshuffled_img_type.push("MM")
  }
}
let img_nat_list = []

for (i=1;i<26;i++){
  if (i<10){
    img_nat_list.push(`img_natural_0${i}.png`)
    unshuffled_img_type.push("NAT")
  } else {
    img_nat_list.push(`img_natural_${i}.png`)
    unshuffled_img_type.push("NAT")
  }
}

var recognition_unshuffled = img_mm_list.concat(img_nat_list);
let slice_recognition_list = []
let recognition_list = [];
let recog_arr = [];

let new_old_unshuff = []
let new_old = []
let shuffled_img_type = []

for (let i = 0; i < recognition_unshuffled.length; i++) {
  recog_arr.push(i);
}
shuffle(recog_arr)
for (let i = 0; i < recognition_unshuffled.length;i++){
  slice_recognition_list.push(recognition_unshuffled[recog_arr[i]])
  if (i < 30){
    new_old_unshuff.push("OLD")
  }else {
    new_old_unshuff.push("NEW")
  }
}

let learn_unshuffled = slice_recognition_list.slice(0,30)
let foil_unshuffled = slice_recognition_list.slice(30)
//var learn_unshuffled=['Aliance.png','Boulder.png','Cornwall.png','Custer.png','DelawareCity.png','Medora.png']
//let foil_unshuffled=['Newport.png','ParkCity.png','Racine.png','Sitka.png','WestPalmBeach.png','Yukon.png']
//  new_old.push(new_old_unshuff[recog_arr[i]])

shuffle(recog_arr)
for (let i = 0; i < recognition_unshuffled.length;i++){
  recognition_list.push(slice_recognition_list[recog_arr[i]])
  shuffled_img_type.push(unshuffled_img_type[recog_arr[i]])
  new_old.push(new_old_unshuff[recog_arr[i]])
}

let learn_img = [];
let learn_arr = [];
for (let i = 0; i < learn_unshuffled.length; i++) {
  learn_arr.push(i);
}
shuffle(learn_arr)
for (let i = 0; i < learn_unshuffled.length;i++){
  learn_img.push(learn_unshuffled[learn_arr[i]])
}

let foil_img = [];
let foil_arr = [];
for (let i = 0; i < foil_unshuffled.length; i++) {
  foil_arr.push(i);
}
shuffle(foil_arr)
for (let i = 0; i < foil_unshuffled.length;i++){
  foil_img.push(foil_unshuffled[foil_arr[i]])
}




