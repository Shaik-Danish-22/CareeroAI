// "use client"

// import { useEffect, useRef, useState } from "react"
// import { useParams, useRouter } from "next/navigation"

// export default function InterviewPage(){

// const params = useParams()
// const router = useRouter()

// const jobId = params.id as string

// const videoRef = useRef<HTMLVideoElement>(null)
// const streamRef = useRef<MediaStream | null>(null)
// const recognitionRef = useRef<any>(null)
// const transcriptRef = useRef("")

// const [questions,setQuestions] = useState<any[]>([])
// const [index,setIndex] = useState(0)

// const [cameraReady,setCameraReady] = useState(false)
// const [recording,setRecording] = useState(false)

// const [answer,setAnswer] = useState("")
// const [answers,setAnswers] = useState<any[]>([])

// const [score,setScore] = useState<any>(null)
// const [showScore,setShowScore] = useState(false)

// const API="http://localhost:8000"

// const token =
// typeof window !== "undefined"
// ? localStorage.getItem("token")
// : null



// /* LOAD QUESTIONS */

// const loadQuestions = async()=>{

// const res = await fetch(
// `${API}/candidate/interview/questions/${jobId}`,
// {
// headers:{
// Authorization:`Bearer ${token}`
// }
// })

// const data = await res.json()

// setQuestions(data.questions || [])

// }



// /* START CAMERA */

// const startCamera = async()=>{

// try{

// const stream = await navigator.mediaDevices.getUserMedia({
// video:true,
// audio:true
// })

// streamRef.current = stream

// if(videoRef.current){

// videoRef.current.srcObject = stream
// await videoRef.current.play()

// }

// setCameraReady(true)

// }catch{

// alert("Allow camera permission")

// }

// }



// /* INIT SPEECH */

// const initSpeech = ()=>{

// const SpeechRecognition =
// (window as any).SpeechRecognition ||
// (window as any).webkitSpeechRecognition

// if(!SpeechRecognition){

// alert("Use Chrome for speech recognition")
// return

// }

// const recognition = new SpeechRecognition()

// recognition.continuous = true
// recognition.interimResults = true
// recognition.lang="en-US"

// recognition.onresult = (event:any)=>{

// let transcript = transcriptRef.current

// for(let i=event.resultIndex;i<event.results.length;i++){

// if(event.results[i].isFinal){

// transcript += event.results[i][0].transcript + " "

// }

// }

// transcriptRef.current = transcript
// setAnswer(transcript)

// }

// recognitionRef.current = recognition

// }



// /* START RECORDING */

// const startRecording = ()=>{

// if(!cameraReady){

// alert("Enable camera first")
// return

// }

// recognitionRef.current.start()
// setRecording(true)

// }



// /* STOP RECORDING */

// const stopRecording = ()=>{

// recognitionRef.current.stop()
// setRecording(false)

// }



// /* SUBMIT ANSWER */

// const submitAnswer = async()=>{

// const q = questions[index]

// const res = await fetch(
// `${API}/candidate/interview/submit-answer`,
// {
// method:"POST",
// headers:{
// "Content-Type":"application/json",
// Authorization:`Bearer ${token}`
// },
// body:JSON.stringify({
// question:q.question,
// answer,
// questionType:q.type
// })
// })

// const data = await res.json()

// setScore(data)
// setShowScore(true)

// setAnswers([
// ...answers,
// {
// question:q.question,
// answer,
// ...data
// }
// ])

// }



// /* NEXT QUESTION */

// const nextQuestion = ()=>{

// setShowScore(false)
// setAnswer("")
// transcriptRef.current=""

// setIndex(i=>i+1)

// }



// /* FINISH INTERVIEW */

// const finishInterview = async()=>{

// const avg =
// answers.reduce((sum,a)=>sum+a.overallScore,0)
// / answers.length

// await fetch(`${API}/candidate/interview/complete`,{
// method:"POST",
// headers:{
// "Content-Type":"application/json",
// Authorization:`Bearer ${token}`
// },
// body:JSON.stringify({
// job_id:jobId,
// answers,
// overall_score:Math.round(avg)
// })
// })

// router.push("/candidate/applications")

// }



// /* INIT */

// useEffect(()=>{

// loadQuestions()
// initSpeech()

// },[])



// if(!questions.length){

// return(
// <div className="p-10 text-center text-xl">
// Loading interview...
// </div>
// )

// }



// const q = questions[index]



// return(

// <div className="min-h-screen bg-gray-100 p-8">

// <div className="max-w-6xl mx-auto space-y-6">


// {/* QUESTION */}

// <div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">

// <h2 className="text-xl font-bold">
// Question {index+1}/{questions.length}
// </h2>

// <p className="text-lg mt-2">
// {q.question}
// </p>

// </div>



// {/* CAMERA + TRANSCRIPT */}

// <div className="grid grid-cols-2 gap-6">


// {/* CAMERA */}

// <div className="bg-black rounded-xl h-[420px] relative overflow-hidden">

// <video
// ref={videoRef}
// autoPlay
// playsInline
// muted
// className="w-full h-full object-cover"
// />

// {!cameraReady &&(

// <button
// onClick={startCamera}
// className="absolute inset-0 m-auto w-48 h-12 bg-blue-600 text-white rounded"
// >
// Enable Camera
// </button>

// )}

// </div>



// {/* TRANSCRIPT */}

// <div className="bg-white border rounded-xl p-6 h-[420px] overflow-y-auto">

// {answer || "Start speaking to see transcription..."}

// </div>



// </div>



// {/* CONTROLS */}

// <div className="flex gap-4">

// {!recording ?(

// <button
// onClick={startRecording}
// className="flex-1 bg-red-600 text-white py-4 rounded"
// >
// Start Recording
// </button>

// ):(

// <button
// onClick={stopRecording}
// className="flex-1 bg-gray-700 text-white py-4 rounded"
// >
// Stop
// </button>

// )}

// <button
// onClick={submitAnswer}
// className="flex-1 bg-blue-600 text-white py-4 rounded"
// >
// Submit
// </button>

// </div>



// {/* SCORE */}

// {showScore && score &&(

// <div className="bg-green-50 border border-green-200 p-6 rounded-xl">

// <h3 className="text-2xl font-bold">
// Score: {score.overallScore}/100
// </h3>

// <div className="mt-4">

// <p className="font-semibold">Content Feedback</p>
// <p>{score.contentScore.feedback}</p>

// </div>

// <div className="mt-4">

// <p className="font-semibold">Delivery Feedback</p>
// <p>{score.deliveryScore.feedback}</p>

// </div>

// <div className="mt-4">

// <p className="font-semibold">Strengths</p>

// <ul className="list-disc pl-6">

// {score.strengths.map((s:any,i:number)=>(
// <li key={i}>{s}</li>
// ))}

// </ul>

// </div>

// <div className="mt-4">

// <p className="font-semibold">Improvements</p>

// <ul className="list-disc pl-6">

// {score.improvementAreas.map((s:any,i:number)=>(
// <li key={i}>{s}</li>
// ))}

// </ul>

// </div>



// {index < questions.length-1 ?(

// <button
// onClick={nextQuestion}
// className="mt-6 bg-green-600 text-white px-6 py-3 rounded"
// >
// Next Question
// </button>

// ):(

// <button
// onClick={finishInterview}
// className="mt-6 bg-purple-600 text-white px-6 py-3 rounded"
// >
// Finish Interview
// </button>

// )}

// </div>

// )}


// </div>

// </div>

// )

// }

"use client"

import { useEffect, useRef, useState } from "react"
import { useParams, useRouter } from "next/navigation"

export default function InterviewPage(){

const params = useParams()
const router = useRouter()

const jobId = params.id as string

const videoRef = useRef<HTMLVideoElement>(null)
const streamRef = useRef<MediaStream | null>(null)
const recognitionRef = useRef<any>(null)
const transcriptRef = useRef("")

const [questions,setQuestions] = useState<any[]>([])
const [index,setIndex] = useState(0)

const [cameraReady,setCameraReady] = useState(false)
const [recording,setRecording] = useState(false)

const [answer,setAnswer] = useState("")
const [answers,setAnswers] = useState<any[]>([])

const [score,setScore] = useState<any>(null)
const [showScore,setShowScore] = useState(false)

const [submitting,setSubmitting] = useState(false)

const API="http://localhost:8000"

const token =
typeof window !== "undefined"
? localStorage.getItem("token")
: null



/* LOAD QUESTIONS */

const loadQuestions = async()=>{

try{

const res = await fetch(
`${API}/candidate/interview/questions/${jobId}`,
{
headers:{
Authorization:`Bearer ${token}`
}
})

const data = await res.json()

setQuestions(data.questions || [])

}catch(error){

console.error("Failed to load questions:",error)
alert("Failed to load interview questions")

}

}



/* START CAMERA */

const startCamera = async()=>{

try{

const stream = await navigator.mediaDevices.getUserMedia({
video:true,
audio:true
})

streamRef.current = stream

if(videoRef.current){

videoRef.current.srcObject = stream
videoRef.current.onloadedmetadata = async()=>{
await videoRef.current?.play()
setCameraReady(true)
}

// Fallback in case metadata event doesn't fire
setTimeout(()=>{
if(!cameraReady){
setCameraReady(true)
}
},1000)

}

}catch(error){

console.error("Camera error:",error)
alert("Allow camera and microphone permission")

}

}



/* INIT SPEECH */

const initSpeech = ()=>{

const SpeechRecognition =
(window as any).SpeechRecognition ||
(window as any).webkitSpeechRecognition

if(!SpeechRecognition){

alert("Use Chrome or Edge for speech recognition")
return

}

const recognition = new SpeechRecognition()

recognition.continuous = true
recognition.interimResults = true
recognition.lang="en-US"

recognition.onresult = (event:any)=>{

let transcript = transcriptRef.current

for(let i=event.resultIndex;i<event.results.length;i++){

if(event.results[i].isFinal){

transcript += event.results[i][0].transcript + " "

}

}

transcriptRef.current = transcript
setAnswer(transcript)

}

recognition.onerror = (event:any)=>{
console.error("Speech recognition error:",event.error)
}

recognitionRef.current = recognition

}



/* START RECORDING */

const startRecording = ()=>{

if(!cameraReady){

alert("Enable camera first")
return

}

if(recognitionRef.current){
recognitionRef.current.start()
setRecording(true)
}

}



/* STOP RECORDING */

const stopRecording = ()=>{

if(recognitionRef.current){
recognitionRef.current.stop()
setRecording(false)
}

}



/* SUBMIT ANSWER */

const submitAnswer = async()=>{

const trimmedAnswer = answer.trim()

if(!trimmedAnswer){
alert("Please provide an answer")
return
}

if(trimmedAnswer.length < 10){
alert("Answer is too short. Please provide at least 10 characters.")
return
}

setSubmitting(true)

try{

const q = questions[index]

console.log("Submitting:",{
question:q.question,
answer:trimmedAnswer,
questionType:q.type
})

const res = await fetch(
`${API}/candidate/interview/submit-answer`,
{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
question:q.question,
answer:trimmedAnswer,
questionType:q.type || "behavioral"
})
})

if(!res.ok){
const errorData = await res.json()
throw new Error(errorData.detail || "Failed to submit answer")
}

const data = await res.json()

console.log("Score received:",data)

setScore(data)
setShowScore(true)

setAnswers([
...answers,
{
question:q.question,
answer:trimmedAnswer,
...data
}
])

}catch(error:any){

console.error("Submit error:",error)
alert(error.message || "Failed to submit answer. Please try again.")

}finally{

setSubmitting(false)

}

}



/* NEXT QUESTION */

const nextQuestion = ()=>{

setShowScore(false)
setScore(null)
setAnswer("")
transcriptRef.current=""

setIndex(i=>i+1)

}



/* FINISH INTERVIEW */

const finishInterview = async()=>{

try{

const avg =
answers.reduce((sum,a)=>sum+(a.overallScore || 0),0)
/ Math.max(answers.length,1)

await fetch(`${API}/candidate/interview/complete`,{
method:"POST",
headers:{
"Content-Type":"application/json",
Authorization:`Bearer ${token}`
},
body:JSON.stringify({
job_id:jobId,
answers,
overall_score:Math.round(avg)
})
})

router.push("/candidate/applications")

}catch(error){

console.error("Failed to complete interview:",error)
alert("Failed to complete interview")

}

}



/* INIT */

useEffect(()=>{

loadQuestions()
initSpeech()
startCamera()

},[])



if(!questions.length){

return(
<div className="p-10 text-center text-xl">
Loading interview...
</div>
)

}



const q = questions[index]



return(

<div className="min-h-screen bg-gray-100 p-8">

<div className="max-w-6xl mx-auto space-y-6">


{/* QUESTION */}

<div className="bg-blue-50 border border-blue-200 p-6 rounded-xl">

<h2 className="text-xl font-bold">
Question {index+1}/{questions.length}
</h2>

<p className="text-lg mt-2">
{q?.question || "Loading..."}
</p>

</div>



{/* CAMERA + TRANSCRIPT */}

<div className="grid grid-cols-2 gap-6">


{/* CAMERA */}

<div className="bg-black rounded-xl h-[420px] relative overflow-hidden">

<video
ref={videoRef}
autoPlay
playsInline
muted
style={{transform:'scaleX(-1)'}}
className="w-full h-full object-cover"
/>

{!cameraReady &&(

<button
onClick={startCamera}
className="absolute inset-0 m-auto w-48 h-12 bg-blue-600 text-white rounded hover:bg-blue-700"
>
Enable Camera
</button>

)}

</div>



{/* TRANSCRIPT */}

<div className="bg-white border rounded-xl p-6 h-[420px] overflow-y-auto">

{answer || "Start speaking to see transcription..."}

</div>



</div>



{/* CONTROLS */}

<div className="flex gap-4">

{!recording ?(

<button
onClick={startRecording}
disabled={submitting}
className="flex-1 bg-red-600 text-white py-4 rounded hover:bg-red-700 disabled:opacity-50"
>
🎤 Start Recording
</button>

):(

<button
onClick={stopRecording}
disabled={submitting}
className="flex-1 bg-gray-700 text-white py-4 rounded hover:bg-gray-800 disabled:opacity-50"
>
⏹️ Stop Recording
</button>

)}

<button
onClick={submitAnswer}
disabled={submitting || !answer.trim()}
className="flex-1 bg-blue-600 text-white py-4 rounded hover:bg-blue-700 disabled:opacity-50"
>
{submitting ? "Submitting..." : "Submit Answer"}
</button>

</div>



{/* SCORE */}

{showScore && score &&(

<div className="bg-green-50 border border-green-200 p-6 rounded-xl">

<h3 className="text-2xl font-bold">
Score: {score.overallScore != null ? score.overallScore : "N/A"}/100
</h3>

{/* Content Feedback */}
{score.contentScore && (
<div className="mt-4">
<p className="font-semibold">Content Feedback</p>
<p>{score.contentScore.feedback || "No feedback available"}</p>
</div>
)}

{/* Delivery Feedback */}
{score.deliveryScore && (
<div className="mt-4">
<p className="font-semibold">Delivery Feedback</p>
<p>{score.deliveryScore.feedback || "No feedback available"}</p>
</div>
)}

{/* Strengths */}
{score.strengths && Array.isArray(score.strengths) && score.strengths.length > 0 && (
<div className="mt-4">
<p className="font-semibold">Strengths</p>
<ul className="list-disc pl-6">
{score.strengths.map((s:any,i:number)=>(
<li key={i}>{s}</li>
))}
</ul>
</div>
)}

{/* Improvements */}
{score.improvementAreas && Array.isArray(score.improvementAreas) && score.improvementAreas.length > 0 && (
<div className="mt-4">
<p className="font-semibold">Areas for Improvement</p>
<ul className="list-disc pl-6">
{score.improvementAreas.map((s:any,i:number)=>(
<li key={i}>{s}</li>
))}
</ul>
</div>
)}



{index < questions.length-1 ?(

<button
onClick={nextQuestion}
className="mt-6 bg-green-600 text-white px-6 py-3 rounded hover:bg-green-700"
>
Next Question →
</button>

):(

<button
onClick={finishInterview}
className="mt-6 bg-purple-600 text-white px-6 py-3 rounded hover:bg-purple-700"
>
Finish Interview
</button>

)}

</div>

)}


</div>

</div>

)

}