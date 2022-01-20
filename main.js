let allContacts = [
    {
        name: 'Michele',
        avatar: '_1',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText: "il primo test è sempre il più bello",
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
        statusText: "se potessi fermare il tempo come una fotografia, prenderei questo momento, ci farei un'enorme gigantografia.",
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
        statusText: "non c'è futuro per chi vive nel passato",
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
        statusText: "non chatto con nessuno, figurati se metto uno stato",
        messages: [
        ], //test su nuova chat
    },
]

dayjs.extend(window.dayjs_plugin_customParseFormat);

let weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

var app = new Vue(
    {
        el: "#root",
        data: {
            
            contacts: allContacts,
            chat: null,
            inputText: null,
            searchBar: null,
            dateToday: dayjs(),
            infoMess: false,
            infoProfile: false,
            inputImage: null,
            infoMessage: {
                text: null,
                date: null,
                status: null,
                image: null,
            },
            infoProfileObj: {
                name: null,
                image: null,
                statusText: null,
                imageSent: [],
            },
        },
        methods: { //AL CLICK APRE LA CHAT CORRISPONDENTE
            openChat: function (elemento) {
                this.switchInfo('all');
                this.chat = elemento;
                for (let i = 0; i < this.contacts.length; i++)
                    this.contacts[i].chatOpen = false;
                elemento.chatOpen = true;
            },
            writeMessage: function (elemento) {
                //PERMETTE DI SCRIVERE MESSAGGI IN CHAT
                let controlloTesto = null;
                if (this.inputText != "" && this.inputText != null)
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
            //arrivasse ma, sono cose che credo faremo più avanti
            //quindi ho lasciato solo l'immagine
            sendImage: function (elemento, target) {
                let input = null;
                let error = "image";
                if (target == 'background')
                    input = document.getElementById("input-image-profile");
                else if (target == 'send')
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
                    if (target == 'send') {
                        elemento.messages.push(newMessage);
                        app.dateFormat();
                        app.reply(elemento);
                    } else {
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
                        date: this.dateToday.format('DD-MM-YYYY:HH-mm'),
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
                //PERMETTE L'APERTURA DEL MENU SUL CLICK SU UN MESSAGGIO
                let menu = document.getElementsByClassName('message-button');
                if (hover)
                    menu[index].style.display = "flex";
                else
                    menu[index].style.display = "none";
            },
            messageMenu: function (index) {
                //MENU SUL CLICK
                if (!this.infoMess || !this.infoProfile) {
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
                } else 
                    this.switchInfo('all');
            },
            showInfo: function (mess) {
                this.switchInfo('message');
                const maxW = document.documentElement.clientWidth;
                let mainChatWidth = document.getElementById('your-chat').clientWidth;
                setTimeout(() => {
                    let elemento = document.getElementById('show-info-box');
                    this.slideInfoBox(elemento, mainChatWidth, maxW);
                    this.infoMessage.text = mess.text;
                    console.log(mess.date);
                    this.infoMessage.date = mess.date.$d + "";
                    console.log(this.infoMessage.date);
                    this.infoMessage.status = mess.status;
                    this.infoMessage.image = mess.image;
                }, 10);
            },
            showInfoProfile: function (chat) {
                if (!this.infoProfile) {
                    const maxW = document.documentElement.clientWidth;
                    let mainChatWidth = document.getElementById('your-chat').clientWidth;
                    setTimeout(() => {
                        let elemento = document.getElementById('show-profile-info-box');
                        this.slideInfoBox(elemento, mainChatWidth, maxW);
                        this.infoProfileObj.name = chat.name;
                        this.infoProfileObj.image = chat.avatar;
                        this.infoProfileObj.statusText = chat.statusText;
                        this.infoProfileObj.imageSent = [];
                        for (let i = 0; i < chat.messages.length; i++) {
                            let erroreStessaImmagine = false;
                            if (chat.messages[i].image != undefined) {
                                for (let j = 0; j < this.infoProfileObj.imageSent.length; j++) {
                                    if (this.infoProfileObj.imageSent[j] == chat.messages[i].image)
                                        erroreStessaImmagine = true;
                                }
                                if (!erroreStessaImmagine) {
                                    this.infoProfileObj.imageSent.push(chat.messages[i].image);
                                    console.log(this.infoProfileObj.imageSent);
                                }
                            }
                        }
                    }, 10);
                }
                this.switchInfo('profile');
            },
            slideInfoBox: function (elemento, mainChatWidth, maxW) {
                if (maxW <= 992) {
                    elemento.style.left = `${maxW / 2 - 100}px`;
                    elemento.style.flex = `1 0 ${mainChatWidth}px`;
                    setTimeout(() => {
                        mainChatWidth = document.getElementById('your-chat').clientWidth;
                        elemento.style.left = `-${mainChatWidth + 1}px`;
                    }, 10);
                }
            },
            switchInfo: function (infoType) {
                if (infoType == 'message') {
                    this.infoMess = !this.infoMess;
                    this.infoProfile = false;
                }
                else if(infoType == 'profile'){
                    this.infoProfile = !this.infoProfile;
                    this.infoMess = false;
                } else if(infoType == 'all'){
                    this.infoProfile = false;
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
                this.switchInfo('all');
            }
        },
        updated: function () {
            //rimuove il menu-box al cambio chat
            let menu = document.getElementsByClassName('message-menu');
            for (let i = 0; i < menu.length; i++) {
                menu[i].style.display = "none";
                menu[i].classList.remove('visible');
            }
        },
        beforeCreate: function () {
            //evento click globale, toglie tutti i pannelli del menu
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