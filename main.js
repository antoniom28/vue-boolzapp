let allContacts = [
    {
        name: 'Michele',
        avatar: '_1',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText : "il primo test è sempre il più bello",
        messages: [
            {
                date: '10/01/2020 15:30:55',
                text: 'Hai portato a spasso il cane?',
                status: 'sent'
            },
            {
                date: '10/01/2020 15:50:00',
                text: 'Ricordati di dargli da mangiare',
                status: 'sent'
            },
            {
                date: '17/01/2020 16:15:22',
                text: 'Tutto fatto!',
                status: 'received'
            }
        ],
    },
    {
        name: 'Fabio',
        avatar: '_2',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText : "se potessi fermare il tempo come una fotografia, prenderei questo momento, ci farei un'enorme gigantografia.",
        messages: [
            {
                date: '20/03/2020 16:30:00',
                text: 'Ciao come stai?',
                status: 'sent'
            },
            {
                date: '20/03/2020 16:30:55',
                text: 'Bene grazie! Stasera ci vediamo?',
                status: 'received'
            },
            {
                date: '19/01/2022 16:42:00',
                text: 'Mi piacerebbe ma devo andare a fare la spesa.',
                status: 'sent'
            }
        ],
    },
    {
        name: 'Samuele',
        avatar: '_3',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText : "non c'è futuro per chi vive nel passato",
        messages: [
            {
                date: '28/03/2020 10:10:40',
                text: 'La Marianna va in campagna',
                status: 'received'
            },
            {
                date: '28/03/2020 10:20:10',
                text: 'Sicuro di non aver sbagliato chat?',
                status: 'sent'
            },
            {
                date: '07/01/2022 16:15:22',
                text: ' Ah scusa! ',
                status: 'received'
            }
        ],
    },
    {
        name: 'Luisa',
        avatar: '_4',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText : "non chatto con nessuno, figurati se metto uno stato",
        messages: [
        ], //test su nuova chat
    },
]

const months = [
    "January", "February", "March", "April", "May", "June", "July",
    "August", "September", "October", "November", "December"
];

let weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

var app = new Vue(
    {
        el: "#root",
        data: {
            contacts: allContacts,
            chat: allContacts[0],
            inputText: null,
            searchBar: null,
            dateToday: dayjs(),
            infoMess: false,
            infoProfile: false,
            inputImage : null,
            infoMessage: {
                text: null,
                date: null,
                status: null,
                image : null,
            },
            infoProfileObj: {
                name : null,
                image : null,
                statusText : null,
            },
        },
        methods: { //AL CLICK APRE LA CHAT CORRISPONDENTE
            openChat: function (elemento) {
                this.infoMess = false;
                this.infoProfile = false;
                this.chat = elemento;
                for (let i = 0; i < this.contacts.length; i++)
                    this.contacts[i].chatOpen = false;
                elemento.chatOpen = true;
            },
            writeMessage: function (elemento) {
                //PERMETTE DI SCRIVERE MESSAGGI IN CHAT
                let controlloTesto = null;
                if(this.inputText != "" && this.inputText != null)
                    controlloTesto = this.inputText.replace(/\s/g, '');
                else
                    return;
                if (controlloTesto != "" && controlloTesto != null) {
                    let newMessage = {
                        date: this.dateToday.format('DD-MM-YYYY:HH-mm'),
                        text: this.inputText,
                        status: 'sent',
                    };
                    elemento.messages.push(newMessage);
                    this.dateFormat();
                    this.inputText = "";
                    this.reply(elemento);
                }
            },
            //volevo fare in modo che capisse che file gli
            //arrivasse ma, sono cose che credo faremo
            //quindi ho lasciato solo l'imm 
            sendImage: function (elemento,target) {
                let input = null;
                let error = "image";
                if(target == 'background')
                    input = document.getElementById("input-image-profile");
                else if(target == 'send')
                    input = document.getElementById("input-image");
                else
                    error = "ci scusiamo per il problema";

                let fReader = new FileReader();
                fReader.readAsDataURL(input.files[0]);
                fReader.onloadend = function (event) {
                    let newMessage = {
                        date: app.$data.dateToday.format('DD-MM-YYYY:HH-mm'),
                        text: error,
                        status: 'sent',
                        image: event.target.result,
                    };
                    if(target == 'send'){
                        elemento.messages.push(newMessage);
                        app.dateFormat();
                        app.reply(elemento);
                    } else{
                        document.getElementById('user-profile-picture').style.backgroundImage = `url(${newMessage.image})`;
                    }
                    input.value = null;
                }
            },
            reply: function (elemento) {
                //LA RISPOSTA AUTOMATICA DEL BOT
                setTimeout(() => {
                    document.querySelector('.typing').style.display = "block";
                }, 500);
                setTimeout(() => {
                    let newMessage = {
                        date: this.dateToday,
                        text: 'ok',
                        status: 'received'
                    };
                    elemento.messages.push(newMessage);
                    this.dateFormat();
                    document.querySelector('.typing').style.display = "none";
                }, 1500);
            },
            searchContact: function () {
                //RICERCA CONTATTI CHE CONTENGONO LE INIZIALI SCRITTE
                let searchTemp = this.searchBar.toLowerCase();
                searchTemp = searchTemp.replace(/\s/g, '');

                for (let i = 0; i < this.contacts.length; i++)
                    this.contacts[i].visible = true;

                if (this.searchBar != null && this.searchBar != "")
                    for (let i = 0; i < this.contacts.length; i++)
                        if (!(this.contacts[i].name.toLowerCase()).includes(searchTemp))
                            this.contacts[i].visible = false;
            },
            showMessageMenu: function (index, hover) {
                //PERMETTE L'APERTURA DEL MENU SUL CLICK
                //SU UN MESSAGGIO
                let menu = document.getElementsByClassName('message-button');
                if (hover)
                    menu[index].style.display = "flex";
                else
                    menu[index].style.display = "none";
            },
            messageMenu: function (index) {
                //MENU SUL CLICK
                if(!this.infoMess || !this.infoProfile){
                    let menu = document.getElementsByClassName('message-menu');
                    //sposta il pannello del cancella messaggio correttamente, 
                    //sopra se si supera la metà della heigth della finestra,
                    //altrimenti sotto
                    if (event.clientY > document.documentElement.clientHeight / 2)
                        menu[index].style.top = "-80px";
                    else
                        menu[index].style.top = "20px";
                    if (menu[index].style.display == "block") {
                        menu[index].style.display = "none";
                        menu[index].classList.remove('visible');
                    } else {
                        menu[index].style.display = "block";
                        setTimeout(() => {
                            menu[index].className += ' visible';
                        }, 0); //aggiungle la classe dopo l'add event a 179js
                    }
                } else{
                    this.infoMess = false;
                    this.infoProfile = false;
                }
            },
            showInfo: function (mess) {
                this.switchInfo('message');
                const maxW = document.documentElement.clientWidth;
                let mainChatWidth = document.getElementById('your-chat').clientWidth;
                setTimeout(() => {
                    if (maxW <= 992) {
                        document.getElementById('show-info-box').style.left = `${maxW / 2 - 100}px`;
                        document.getElementById('show-info-box').style.flex = `1 0 ${mainChatWidth}px`;
                        setTimeout(() => {
                            mainChatWidth = document.getElementById('your-chat').clientWidth;
                            document.getElementById('show-info-box').style.left = `-${mainChatWidth + 1}px`;
                        }, 10);
                    }
                    this.infoMessage.text = mess.text;
                    this.infoMessage.date = mess.date;
                    this.infoMessage.status = mess.status;
                    this.infoMessage.image = mess.image;
                }, 10);
            },
            showInfoProfile: function (chat) {
                this.switchInfo('profile');
                console.log(chat);
                const maxW = document.documentElement.clientWidth;
                let mainChatWidth = document.getElementById('your-chat').clientWidth;
                setTimeout(() => {
                    if (maxW <= 992) {
                        document.getElementById('show-profile-info-box').style.left = `${maxW / 2 - 100}px`;
                        document.getElementById('show-profile-info-box').style.flex = `1 0 ${mainChatWidth}px`;
                        setTimeout(() => {
                            mainChatWidth = document.getElementById('your-chat').clientWidth;
                            document.getElementById('show-profile-info-box').style.left = `-${mainChatWidth + 1}px`;
                        }, 10);
                    }
                    this.infoProfileObj.name = chat.name;
                    this.infoProfileObj.image = chat.avatar;
                    this.infoProfileObj.statusText = chat.statusText;
                }, 10);
            },
            switchInfo: function (infoType) {
                if(infoType == 'message'){
                    this.infoMess = !this.infoMess;
                    this.infoProfile = false;
                }
                else{
                    this.infoProfile = !this.infoProfile;
                    this.infoMess = false;
                }
            },
            deleteMessage: function (mess, index) {
                //PERMETTE DI CANCELLARE IL MESSAGGIO AL CLICK
                let deleteTheMessage;
                for (let i = 0; i < this.contacts.length; i++) {
                    deleteTheMessage = this.contacts[i].messages.indexOf(mess);
                    if (deleteTheMessage != -1) {
                        deleteTheMessage = i;
                        break;
                    }
                }
                this.contacts[deleteTheMessage].messages.splice(index, 1);
                this.messageMenu(index);
            },
            dateFormat: function () {
                //converte e poi modifica tutte le date dei messaggi
                //inoltre aggiorna l'ultimo messaggio ricevuto/inviato
                dayjs.extend(window.dayjs_plugin_customParseFormat);
                let contact = this.contacts;
                for (let i = 0; i < contact.length; i++) {
                    let message = contact[i].messages;
                    for (let j = 0; j < message.length; j++) {
                        let time = dayjs(message[j].date, "DD-MM-YYYY:HH-mm");
                        contact[i].lastMessage = time.$D + "/" + (time.$M + 1) + "/" + time.$y;
                        message[j].date = time;
                        if (j == message.length - 1) {
                            const date1 = this.dateToday;
                            const date2 = time;
                            date1.format('DD-MM-YYYY:HH-mm');
                            date2.format('DD-MM-YYYY:HH-mm');
                            let difference = date1.diff(date2, 'week');
                            if (difference == 0) {
                                difference = date1.$D - date2.$D;
                                if (difference == 0)
                                    contact[i].lastMessage = date1.$H + ":" + date2.$m;
                                else if (difference == 1)
                                    contact[i].lastMessage = 'Yesterday';
                                else
                                    contact[i].lastMessage = weekdays[difference];
                            }
                        }
                    }
                }

            },
            resize: function () {
                this.infoMess = false;
                this.infoProfile = false;
               /* console.log(document.documentElement.clientWidth);
                    if (window.innerWidth > document.documentElement.clientWidth) {
                        document.getElementById('root').style.height = `calc(100vh - 16px)`;
                    } else
                        document.getElementById('root').style.height = `100vh`;*/
            }
        },
        updated: function () {
            //rimuove il menu al cambio chat, 
            //perché se si lasciava il pannello
            //del menu sul messaggio, rimaneva anche in un
            //messaggio a caso su un'altra chat
            let menu = document.getElementsByClassName('message-menu');
            for (let i = 0; i < menu.length; i++){
                menu[i].style.display = "none";
                menu[i].classList.remove('visible');
            }
        },
        beforeCreate: function () {
            //evento click globale, toglie tutti i pannelli
            //del menu
            window.addEventListener('click', function () {
                let menu = document.getElementsByClassName('message-menu');
                for (let i = 0; i < menu.length; i++)
                    if (menu[i].classList.contains('visible')) {
                        menu[i].classList.remove('visible');
                        menu[i].style.display = "none";
                    }
            });
        },
        created: function () {
            window.addEventListener('load', this.resize);
            window.addEventListener('resize', this.resize);
            this.dateFormat();
        }
    }
);