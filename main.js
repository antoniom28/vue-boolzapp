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

Vue.use(EmojiPicker);

var app = new Vue(
    {
        el: "#root",
        data: {
            search: '',
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
        methods:
        { 
            append: function (emoji) {
                if (this.inputText == null)
                    this.inputText = ""
                this.inputText += emoji
                document.getElementById('send-icons-plane').style.display = "block";
                document.getElementById('mic-icons-plane').style.display = "none";
            },
            //AL CLICK APRE LA CHAT CORRISPONDENTE
            openChat: function (elemento) {
                this.inputText = null,
                    this.switchInfo('all');
                this.chat = elemento;
                for (let i = 0; i < this.contacts.length; i++)
                    this.contacts[i].chatOpen = false;
                elemento.chatOpen = true;
                this.scrollLastMessage();
            },
            writeMessage: function (elemento) {
                //PERMETTE DI SCRIVERE MESSAGGI IN CHAT
                if (this.controllaInput() != "" && this.controllaInput() != null) {
                    let newMessage = {
                        date: this.dateToday.format('DD-MM-YYYY:HH-mm'),
                        text: this.inputText,
                        status: 'sent',
                    };
                    elemento.messages.push(newMessage);
                    this.dateFormat();
                    this.inputText = "";
                    this.reply(elemento);
                    document.getElementById('send-icons-plane').style.display = "none";
                    document.getElementById('mic-icons-plane').style.display = "block";

                    this.scrollLastMessage();
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
                    app.scrollLastMessage();
                }
            },
            reply: function (elemento) {
                //LA RISPOSTA AUTOMATICA DEL BOT
                setTimeout(() => {
                    document.querySelector('.typing').style.display = "block";
                }, 10);
                setTimeout(() => {
                    let newMessage = {
                        date: this.dateToday.format('DD-MM-YYYY:HH-mm'),
                        text: 'ok',
                        status: 'received'
                    };
                    elemento.messages.push(newMessage);
                    this.dateFormat();
                    document.querySelector('.typing').style.display = "none";
                    this.scrollLastMessage();
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
                //mostra il box delle informazioni del contatto
                if (!this.infoProfile) {
                    const maxW = document.documentElement.clientWidth;
                    let mainChatWidth = document.getElementById('your-chat').clientWidth;
                    setTimeout(() => {
                        let elemento = document.getElementById('show-profile-info-box');
                        this.slideInfoBox(elemento, mainChatWidth, maxW);
                        this.infoProfileObj.name = chat.name;
                        this.infoProfileObj.image = chat.avatar;
                        console.log(chat.avatar, this.infoProfileObj.image);
                        this.infoProfileObj.statusText = chat.statusText;

                        this.infoProfileObj.imageSent = [];
                        for (let i = 0; i < chat.messages.length; i++) {
                            let errorSameImage = false;
                            if (chat.messages[i].image != undefined) {
                                for (let j = 0; j < this.infoProfileObj.imageSent.length; j++) {
                                    if (this.infoProfileObj.imageSent[j] == chat.messages[i].image)
                                        errorSameImage = true;
                                }
                                if (!errorSameImage) {
                                    this.infoProfileObj.imageSent.push(chat.messages[i].image);
                                    console.log(this.infoProfileObj.imageSent);
                                }
                            }
                        }
                    }, 10);
                }
                this.switchInfo('profile');
            },
            //sotto i 992px le info box copriranno tutta la chat
            //sopra verranno affiancate
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
            //funzione per mostrare o no le box info,
            //e fa in modo di non poterle aprire insieme
            switchInfo: function (infoType) {
                if (infoType == 'message') {
                    this.infoMess = !this.infoMess;
                    this.infoProfile = false;
                }
                else if (infoType == 'profile') {
                    this.infoProfile = !this.infoProfile;
                    this.infoMess = false;
                } else if (infoType == 'all') {
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
            showNewBox : function(show){
                if(show)
                    document.getElementById('add-new-contact-box').style.display ="flex";
                else
                    document.getElementById('add-new-contact-box').style.display ="none";
            },
            //aggiunge un nuovo contatto alla lista amici
            addNewContact : function(){
                let contact = document.getElementById('add-new-contact').value;
                if(this.controllaInput(contact)!= null && this.controllaInput(contact)!= ''){
                    console.log(contact);
                    setTimeout(() => {
                        this.contacts.push({
                            name: contact,
                            avatar: `_${this.contacts.length - 3}`,
                            visible: true,
                            chatOpen: false,
                            lastMessage: null,
                            statusText: "Hey there! I am using WhatsApp.",
                            messages: []
                        });
                        document.getElementById('add-new-contact').value = "";
                        this.showNewBox(false);
                    }, 100);
                }
            },
            //ci avevo messo altre cose ma poi le ho cancellate,
            resize: function () {
                this.switchInfo('all');
            },
            //attiva l'icona dell'invia messaggio allo scrivere su testo
            showSendIcons: function () {
                if (this.controllaInput() != "" && this.controllaInput() != null) {
                    document.getElementById('send-icons-plane').style.display = "block";
                    document.getElementById('mic-icons-plane').style.display = "none";
                } else {
                    document.getElementById('send-icons-plane').style.display = "none";
                    document.getElementById('mic-icons-plane').style.display = "block";
                }
            },
            controllaInput: function (input) {
                let controlloTesto = null;
                if(input != "" && input != null){
                    controlloTesto = input.replace(/\s/g, '');
                    return controlloTesto;
                } else if (this.inputText != "" && this.inputText != null) {
                    controlloTesto = this.inputText.replace(/\s/g, '');
                    return controlloTesto;
                } else
                    return null;
            },
            scrollLastMessage: function () {
                setTimeout(() => {
                    let chatDisplay = document.getElementById('chat');
                    //giusto per essere sicuri 
                    chatDisplay.scrollTop = chatDisplay.clientHeight + 2000;
                }, 0);
            }
        },
        updated: function () {
            //rimuove il menu-box al cambio chat
            let menu = document.getElementsByClassName('message-menu');
            for (let i = 0; i < menu.length; i++) {
                menu[i].style.display = "none";
                menu[i].classList.remove('visible');
            }

            if(document.querySelector('.typing'))
                document.querySelector('.typing').style.display = "none";
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
            setTimeout(() => {
                //schermata primo caricamento
                document.getElementById('wait-load').style.display = "none";
                document.getElementById('root').style.display = "flex";
            }, 1000);
        }
    }
);