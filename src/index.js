import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import GroupsPage from './Components/GroupsPage/GroupsPage'
import ManagersPage from './Components/ManagersPage/ManagersPage'
import MessagesPage from './Components/MessagesPage/MessagesPage'
import SettingsPage from './Components/SettingsPage/SettingsPage'
import LoginPage from './Components/LoginPage/LoginPage'

const TOKEN = 'test_token'
const DURATION_START = 60
const BOT_ANSW_TIME = 1
const GOOGLE_DRIVE_FOLDER_ID = '19lHVhlQXEyPRL1HB-x2Z2DFEriFqFMuU'
const GROUP_ANSWER_INTERVAL = 60
const MANAGER_ANSWER_INTERVAL = 30
const ADMIN_EMAIL = 'test@gmail.com'
const GOOGLE_DRIVE_AUTHENTICATION_KEY = `{
  "type": "service_account",
  "project_id": "chatbot-282112",
  "private_key_id": "de954eaf0f940b76e76da177f96cc4735bd99560",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQCaOc7CGVB27STl\nhW00/VvqWEnBMVzBbDoonsQOEhM7wK1nkavtcmpvI+02WRg/GN6+cMVOAFkV5si3\nJYzRAKjUzPUGU3RH0G0adfcSn2AR1g99XbG9es3Jo6cUcipDPYGnbytszfCJhtNH\nMzKQppc3JqpGKN4HwhSG2WKMS1Ah5qz+H2RHbXyWNJq6t+ZQydsKbuAhl6nY5u9k\nmc9kgRSWEdNiCu3fBuXFuKVMZFfm0PYn6Ufh5R89T0wSp00yHNot7Lo7I4ITAC/J\ntFy8y4JK9o/pR1T98n81NM6eiXiPM1RGgfoDdsXuTurC2iwRfHo3lSQQ/I6iyurX\nFhk+i/HzAgMBAAECggEAFmiXLHKl01x/mO3Qa/udcv5jBl7CvcPuQLVY1+aJGYx/\nEDuv7G9McbDu/Y+Sdfs0xMej6MJ6LzQk2R+WnKOTjwqSANpNXJs3JGTG19OFD50N\nC8fPqdqsXe5DujUgWObDQ5hj3zTztzfPflqSWpwp/98ZVy+xmxT4YI44wxkKSp0n\nipGbF75JAU7wvhoP4PrUl7mQU73VZYnvIbR7gKWCpjjzJKQ1Oxenbee0OjaKu2UV\nH/RUNMEPf5CTXodAahF1GIWwqCRMMrYY0zaC+iIiYGVrcW5TjU8q/d4jWW1ehYsr\n+Vi2anLmN1mJviL8raCLRwSjprRB1EnDV99WVb+KKQKBgQDUTD4tq3AD4HMjZjWl\nZ3TqDHxa9eucO2X/qy/MLRWCxHS1xE2psXpYubKqoKQ1aG6R0Not1FgIdA22xYJ8\nFCaxYfk+7g/IkifQvlpcxvqmfifx6xFh/Oo9BPDhje+vYt+/cbp/koHX19YsRL/S\nGGO9Mm5F8zbYztGc080iF5WELwKBgQC5+UMgJtPlvsNtZAtM9FXSdql5egtIOwuB\nm4LpIqgD4vSxySptrdNQYZndjHIVH/+/ujIS4a/aN50bjt4s/58qsCZQli9u3RhC\nsO5ZvGpII07St4VCC1hrRoo0Uc+1N+5G4UntOSwvnZ/+FRd4iq+0WSrGVR7MjGRr\n0bppOndJfQKBgCetzF1K0pfW5o4yN0qf6IkqJj/2AMBlla3QeBGIR6H2R/4FH6Lc\nygo1QwCDH83fo/La/zxbmMyTrFCB396DAaxbrHMnmYmaT5jDSy5V/lkJ8TtU/R28\nYKdg+gieN7MnHrywa/QWFPCbpasGenexGUsuVs/6IkEpfqH6MDf0Anz/AoGAJsEb\nzOJqe9Dh9rTHahTsoXwa2vakzTuIrUyT3jNbodu0tCvAjLSReYmtP67Zwy8042ZQ\nswCW3bmDItAF2oi2SXYFtftmDQtD1/n44XhTCY9aCK03tsiYd1puyHJX/2KVY+3k\nsuucGpwVUCRjDLqR3NpMAKKSVXvYHWPKHc2SOB0CgYEAn85Ccev8bhW21esWyBrS\n23QrNbzeHNoAoFNp9mJVK24FEm79LSZhD60MLaCjMjDIGCL2QLG/1GYokak1lSF5\n1uuMenfMbffJOZkIVJ7nJY6ofQ4jchgu4JA1ouA1yUSuHXReoRfoIm5dK4Dr2OaI\nuiy46ZQVoBe7pkY+9APdC2o=\n-----END PRIVATE KEY-----\n",
  "client_email": "chatbottelegram@chatbot-282112.iam.gserviceaccount.com",
  "client_id": "103573263103065848111",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/chatbottelegram%40chatbot-282112.iam.gserviceaccount.com"
}`
const REPLICAS_TYPES = {
  without_buttons: 'Без кнопок',
  with_buttons: 'С кнопками',
}
const BUTTON_TYPES = {
  text: 'Текстовая',
  file: 'Файловая'
}
const BOT_REPLICAS = [
  { text: 'Добрый день, я могу вам чем - нибудь помочь?', type: REPLICAS_TYPES.without_buttons },
  { 
    text: 'Выберите ваш город', 
    type: REPLICAS_TYPES.with_buttons, 
    buttons: [
      { text: 'Алматы', type: BUTTON_TYPES.text }, 
      { text: 'Кустанай', type: BUTTON_TYPES.text }, 
      { text: 'Тараз', type: BUTTON_TYPES.text} 
    ]
  },
  {
    text: 'Что желаете перевести?',
    type: REPLICAS_TYPES.with_buttons,
    buttons: [
      { text: 'Текст', type: BUTTON_TYPES.text },
      { text: 'Документ', type: BUTTON_TYPES.text }
    ]
  },
  {
    text: 'Заверить перевод у нотариуса?',
    type: REPLICAS_TYPES.with_buttons,
    buttons: [
      { text: 'Да', type: BUTTON_TYPES.text },
      { text: 'Нет', type: BUTTON_TYPES.text }
    ]
  },
  {
    text: 'У вас есть возможность прикрепить файл?',
    type: REPLICAS_TYPES.with_buttons,
    buttons: [
      { text: 'Прикрепить файл', type: BUTTON_TYPES.file },
      { text: 'Нет', type: BUTTON_TYPES.text }
    ]
  }
]

const managers = [
  { name: 'm1_name', surname: 'm1_surname', username : 'manager_1', date: '26.08.20', status: 'status', groups : [true, false, false] },
  { name: 'm2_name', surname: 'm2_surname', username : 'manager_2', date: '26.08.20', status: 'status', groups : [false, true, false] },
  { name: 'm3_name', surname: 'm3_surname', username : 'manager_3', date: '26.08.20', status: 'status', groups : [false, false, true] },
  { name: 'm4_name', surname: 'm4_surname', username : 'manager_4', date: '26.08.20', status: 'status', groups : [true, true, false] },
  { name: 'm5_name', surname: 'm5_surname', username : 'manager_5', date: '26.08.20', status: 'status', groups : [true, false, true] },
  { name: 'm6_name', surname: 'm6_surname', username : 'manager_6', date: '26.08.20', status: 'status', groups : [false, true, true] },
  { name: 'm7_name', surname: 'm7_surname', username : 'manager_7', date: '26.08.20', status: 'status', groups : [true, true, true] },
  { name: 'm8_name', surname: 'm8_surname', username : 'manager_8', date: '26.08.20', status: 'status', groups : [false, false, false]},
]

const cities = [
  'Город 1',
  'Город 2',
  'Город 3'
]

const rooms = [{
    id:1,
    chatID:435274667,
    groupID:1,
    replicID:7,
    lastMessage:14,
    messagesID:[1,2,3,4,5,6,7,8,9,10,11,12,13,14],
    chatRoom: "44ed696a-60e5-452b-b10f-89d465dc34ea",
    mute:0,
    status:1
  },
  {
    id:2,
    chatID:0,
    groupID:0,
    replicID:2,
    lastMessage:20,
    messagesID:[15,16,17,18,19,20],
    chatRoom: "6ff04349-19e7-4c02-b2e0-b0003ec15464",
    mute:0,
    status:0
  },
  {
    id:3,
    chatID:0,
    groupID:0,
    replicID:2,
    lastMessage:22,
    messagesID:[21,22],
    chatRoom: "4ce26753-0199-4a9a-b443-9c513c20448d",
    mute:0,
    status:1
  },
  {
    id:4,
    chatID:0,
    groupID:0,
    replicID:2,
    lastMessage:23,
    messagesID:[23],
    chatRoom: "1ae05aca-e784-4eb0-b58a-540868fd4384",
    mute:0,
    status:1
  },
  {
    id:5,
    chatID:0,
    groupID:0,
    replicID:2,
    lastMessage:25,
    messagesID:[24,25],
    chatRoom: "929b9cb6-9329-4942-b46d-66efa58ca72c",
    mute:0,
    status:1
  },
  {
    id:6,
    chatID:0,
    groupID:1,
    replicID:5,
    lastMessage:67,
    messagesID:[26,27,28,29,30,31,32,33,34,35,36,37,38,39,40,41,42,43,44,45,46,47,48,49,50,53,54,55,56,58,64,65,66,67],
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    mute:0,
    status:0
  },
  {
    id:7,
    chatID:0,
    groupID:1,
    replicID:4,
    lastMessage:76,
    messagesID:[68,69,70,71,72,73,74,75,76],
    chatRoom: "5dcfc437-eb81-4ede-bda3-73748f45d434",
    mute:0,
    status:1
  },
  {
    id:8,
    chatID:0,
    groupID:1,
    replicID:6,
    lastMessage:103,
    messagesID:[77,78,79,80,81,82,83,84,85,86,87,88,89,90,91,92,93,94,95,96,97,98,99,100,101,102,103],
    chatRoom: "a666065f-bf61-40cb-b949-fc42c300cfaa",
    mute:0,
    status:0
  },
  {
    id:10,
    chatID:0,
    groupID:4,
    replicID:6,
    lastMessage:125,
    messagesID:[107,108,109,110,111,112,113,114,115,116,117,118,119,120,121,122,123,124,125],
    chatRoom: "2957a27b-75f4-4c8c-bc5a-7cf134345fe3",
    mute:0,
    status:0
  },
  {
    id:11,
    chatID:0,
    groupID:4,
    replicID:6,
    lastMessage:146,
    messagesID:[126,127,128,129,130,131,132,133,134,135,136,137,138,139,140,141,142,143,144,145,146],
    chatRoom: "9d3cd952-e187-4388-b647-e6a36ce09d4a",
    mute:0,
    status:1
  }
]

const messages = [
  {
    id: 26,
    chatID: -1,
    groupID: 0,
    replicID: 1,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Добый день. Я могу Вам чем нибудь помочь?",
    date: "2020-08-21 09:07:10",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 27,
    chatID: 0,
    groupID: 0,
    replicID: 2,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfghjkl;",
    date: "2020-08-21 09:07:27",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 28,
    chatID: -1,
    groupID: 0,
    replicID: 2,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Выберите Ваш город",
    date: "2020-08-21 09:07:32",
    status: 1,
    type: "select",
    dataType: "	Алматы,Кустанай"
  },
  {
    id: 29,
    chatID: 0,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Алматы",
    date: "2020-08-21 09:08:14",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 30,
    chatID: 0,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfgh",
    date: "2020-08-21 09:08:17",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 31,
    chatID: 0,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfgh",
    date: "2020-08-21 09:08:19",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 32,
    chatID: 0,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfgh",
    date: "2020-08-21 09:08:21",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 33,
    chatID: 0,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfghjkl",
    date: "2020-08-21 09:10:14",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 34,
    chatID: 0,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Алматы",
    date: "2020-08-21 09:15:01",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 35,
    chatID: -1,
    groupID: 1,
    replicID: 3,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Что желаете перевести?",
    date: "2020-08-21 09:15:06",
    status: 1,
    type: "button",
    dataType: "	Текст,Личные документы"
  },
  {
    id: 36,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Текст",
    date: "2020-08-21 10:00:02",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 37,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "ghjghjg",
    date: "2020-08-21 10:05:24",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 38,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "jsgdakkjasdf",
    date: "2020-08-21 10:05:37",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 39,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfgsdfgsdfg",
    date: "2020-08-21 10:07:17",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 40,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "dgshjhkjsdfg",
    date: "2020-08-21 10:09:36",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 41,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfgsdfgsdfg",
    date: "2020-08-21 10:09:42",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 42,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfgdsf",
    date: "2020-08-21 10:10:04",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 43,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Kritin",
    date: "2020-08-21 10:10:26",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 44,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Tratata",
    date: "2020-08-21 10:45:54",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 45,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "nice",
    date: "2020-08-21 10:47:43",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 46,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "nice",
    date: "2020-08-21 11:01:53",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 47,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "nice",
    date: "2020-08-21 11:06:38",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 48,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "nice answer",
    date: "2020-08-21 11:20:06",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 49,
    chatID: -1,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Заверить перевод у нотариуса?",
    date: "2020-08-21 11:20:11",
    status: 1,
    type: "button",
    dataType: "	Да,Нет"
  },
  {
    id: 50,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Да ну нафиг",
    date: "2020-08-21 11:22:17",
    status: 1,
    type: "text",
    dataType: "	 "
  },
  {
    id: 53,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfghjkl",
    date: "2020-08-21 11:29:54",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 54,
    chatID: -1,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Заверить перевод у нотариуса?",
    date: "2020-08-21 11:29:59",
    status: 1,
    type: "button",
    dataType: "	Да,Нет"
  },
  {
    id: 55,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "sdfghjkl",
    date: "2020-08-21 11:29:54",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 56,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "4561264",
    date: "2020-08-21 11:37:35",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 58,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "75zdfg46",
    date: "2020-08-21 11:41:47",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 64,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "fghjfghj",
    date: "2020-08-21 11:58:53",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 65,
    chatID: -1,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Заверить перевод у нотариуса?",
    date: "2020-08-21 11:59:00",
    status: 1,
    type: "button",
    dataType: "	Да,Нет"
  },
  {
    id: 66,
    chatID: 0,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Нет",
    date: "2020-08-21 11:59:03",
    status: 1,
    type: "text",
    dataType: "	"
  },
  {
    id: 67,
    chatID: -1,
    groupID: 1,
    replicID: 4,
    chatRoom: "fe282115-86c8-4e1c-b269-88d13d11662e",
    message: "Заверить перевод у нотариуса?",
    date: "2020-08-21 11:59:09",
    status: 1,
    type: "button",
    dataType: "	Да,Нет"
    }
  ]

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path='/admin/login' component={ LoginPage }/>
        <Route exact path='/admin/messages' component={ MessagesPage }/>
        <Route exact path='/admin/managers' render={ (props) => <ManagersPage managers={ managers }/> } />
        <Route exact path='/admin/groups' render={ (props) => <GroupsPage managers={ managers } cities={ cities }/> }/>
        <Route exact path='/admin/settings' render={ (props) => <SettingsPage token={ TOKEN } 
          folderId={ GOOGLE_DRIVE_FOLDER_ID } authKey={ GOOGLE_DRIVE_AUTHENTICATION_KEY } adminEmail={ ADMIN_EMAIL }
          groupAnswInterval={ GROUP_ANSWER_INTERVAL } managerAnswInterval={ MANAGER_ANSWER_INTERVAL } replicas={ BOT_REPLICAS }
          answTime={ BOT_ANSW_TIME } durationStart={ DURATION_START } {...props}/> }
        />
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);