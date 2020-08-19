import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './index.css';
import GroupsPage from './Components/GroupsPage/GroupsPage'
import ManagersPage from './Components/ManagersPage/ManagersPage'
import MessagesPage from './Components/MessagesPage/MessagesPage'
import SettingsPage from './Components/SettingsPage/SettingsPage'

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
  start: 'START',
  with_buttons: 'BUTTONS'
}
const BUTTON_TYPES = {
  text: 'TEXT',
  file: 'FILE'
}
const BOT_REPLICAS = [
  { text: 'Добрый день, я могу вам чем - нибудь помочь?', type: REPLICAS_TYPES.start },
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

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Switch>
        <Route exact path='/admin/messages' component={ MessagesPage }/>
        <Route exact path='/admin/managers' component={ ManagersPage }/>
        <Route exact path='/admin/groups' component={ GroupsPage }/>
        <Route exact path='/admin/settings' render={ (props) => <SettingsPage token={ TOKEN } 
          folderId={ GOOGLE_DRIVE_FOLDER_ID } authKey={ GOOGLE_DRIVE_AUTHENTICATION_KEY } adminEmail={ ADMIN_EMAIL }
          groupAnswInterval={ GROUP_ANSWER_INTERVAL } managerAnswInterval={ MANAGER_ANSWER_INTERVAL } replicas={ BOT_REPLICAS }
          answTime={ BOT_ANSW_TIME } durationStart={ DURATION_START } {...props}/> }/>
      </Switch>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);