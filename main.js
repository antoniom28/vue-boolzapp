let allContacts = [
    {
        name: 'Michele',
        avatar: 'img/avatar/avatar_1.jpg',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText: "il primo test è sempre il più bello",
        lastAccess : null,
        messages: [
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
        avatar: 'img/avatar/avatar_2.jpg',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText: "se potessi fermare il tempo come una fotografia, prenderei questo momento, ci farei un'enorme gigantografia.",
        lastAccess : null,
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
        avatar: 'img/avatar/avatar_3.jpg',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText: "non c'è futuro per chi vive nel passato",
        lastAccess : null,
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
        avatar: 'img/avatar/avatar_4.jpg',
        visible: true,
        chatOpen: false,
        lastMessage: null,
        statusText: "non chatto con nessuno, figurati se metto uno stato",
        lastAccess : null,
        messages: [
        ], //test su nuova chat
    },
]

dayjs.extend(window.dayjs_plugin_customParseFormat);

let frasi = [
    "Perfetto","Va bene","Heilà","Tutto bene",
    "Er0r3: 18, volevo dire Ciao..","a te e famiglia","Non sto tanto bene oggi scusami..",
    "A che ora avevi detto oggi?","ma quindi domani cosa si fa?",
    "Guarda che sono un bot","sto mangiando, ci sentiamo dopo"
    ,"chiamami direttamente no?","Bella foto","oh ma quando cambi foto profilo?"
];

let weekdays = [
    "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"
];

let fontList = ["sans-serif","cursive","normal","monospace","fantasy"];
let fontSelected = 1;

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
            darkTheme : false,
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
                const maxW = document.documentElement.clientWidth;
                if(maxW <= 768){
                    document.getElementById('contacts').style.display ="none";
                    setTimeout(() => {
                        document.getElementById('your-chat').style.display ="block";
                    }, 10);
                }
            },
            closeChat : function(){
                document.getElementById('contacts').style.display ="block";
                setTimeout(() => {
                    document.getElementById('your-chat').style.display ="none";
                }, 10);
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
                elemento.lastAccess = "Typing";
                setTimeout(() => {
                    let random = Math.floor(Math.random()*frasi.length);
                    let newMessage = {
                        date: this.dateToday.format('DD-MM-YYYY:HH-mm'),
                        text: frasi[random],
                        status: 'received'
                    };
                    elemento.messages.push(newMessage);
                    this.dateFormat();
                    elemento.lastAccess = "Online";
                    setTimeout(() => {
                        this.timeAdjust(this.dateToday);
                        elemento.lastAccess = `Ultimo accesso alle ${this.dateToday.$H}:${this.dateToday.$m}`;
                    }, 2500);
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

                    this.openBox(menu[index]);
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
                    this.infoMessage.date = mess.date.$d + "";
                    this.infoMessage.status = mess.status;
                    this.infoMessage.image = mess.image;
                }, 10);
            },
            showInfoProfile: function (chat) {
                //mostra il box delle informazioni del contatto
                if (!this.infoProfile) {
                    //calcola la max-width 
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
                            let errorSameImage = false;
                            if (chat.messages[i].image != undefined) {
                                for (let j = 0; j < this.infoProfileObj.imageSent.length; j++) {
                                    if (this.infoProfileObj.imageSent[j] == chat.messages[i].image)
                                        errorSameImage = true;
                                }
                                if (!errorSameImage) {
                                    this.infoProfileObj.imageSent.push(chat.messages[i].image);
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
                //this.messageMenu(index);
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
                            let difference = date1.diff(date2, 'week');
                            if (difference == 0) {
                                difference = date1.$D - date2.$D;
                                if (difference == 0){
                                    this.timeAdjust(date1,date2);
                                    contact[i].lastMessage = date1.$H + ":" + date2.$m;
                                }
                                else if (difference == 1)
                                    contact[i].lastMessage = 'Yesterday';
                                else
                                    contact[i].lastMessage = weekdays[difference];
                            }
                        }
                        this.timeAdjust(message[j].date);
                    }
                }
            },
            timeAdjust : function(time,time2) {
                if(time2 == undefined){
                    if(time.$H < 10)
                        time.$H = '0'+time.$H;
                    if(time.$m < 10)
                        time.$m = '0'+time.$m;
                } else {
                    if(time.$H < 10)
                        time.$H = '0'+time.$H;
                    if(time2.$m < 10)
                    time2.$m = '0'+time2.$m;
                }
            },
            showNewBox : function(show){
                if(show)
                    document.getElementById('add-new-contact-box').style.display ="flex";
                else
                    document.getElementById('add-new-contact-box').style.display ="none";

                    //in realtà andava messo - "width del div profilo"
                    //ma ho messo una width fissa al primo quindi ho lasciato cosi
                    document.getElementById('add-new-contact-box').style.left ="-300px";
                    setTimeout(() => {
                        document.getElementById('add-new-contact-box').style.left ="0";
                    }, 10);
            },
            //aggiunge un nuovo contatto alla lista amici
            addNewContact : function(){
                let contact = document.getElementById('add-new-contact').value;
                let contactUrl = document.getElementById('add-new-contact-url').value;
                let imgToPut = 'img/avatar/avatar_'+(this.contacts.length + 1)+'.jpg';
                if(contactUrl.includes('.jpg') || contactUrl.includes('.png'))
                    imgToPut = contactUrl;
                if(this.controllaInput(contact)!= null && this.controllaInput(contact)!= '')
                    if(contactUrl!= null && contactUrl!= '') 
                        setTimeout(() => {
                            this.contacts.push({
                                name: contact,
                                avatar: imgToPut,
                                visible: true,
                                chatOpen: false,
                                lastMessage: null,
                                statusText: "Hey there! I am using WhatsApp.",
                                lastAccess : null,
                                messages: []
                            });
                            document.getElementById('add-new-contact').value = "";
                            document.getElementById('add-new-contact-url').value = "";
                            this.showNewBox(false);
                        }, 100);
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
                        chatDisplay.scrollTop = chatDisplay.scrollHeight;
                }, 20);
            },
            changeFont : function() {
                document.getElementById('root').style.fontFamily = fontList[fontSelected++];
                if(fontSelected >= fontList.length)
                    fontSelected = 0;
            },
            changeTheme: function() {
                this.darkTheme = !this.darkTheme;                
            },
            openSettings : function (){
                this.openBox(document.getElementById('settings-box'));
            },
            openChatSettings : function() {
                this.openBox(document.getElementById('chat-settings-box'));
            },
            deleteChat : function(chat) {
                chat.messages = [];
            },
            deleteContact : function(chat) {
                this.switchInfo('all');
                setTimeout(() => {
                    let deleteTheContact;
                    deleteTheContact = this.contacts.indexOf(chat);
                this.contacts.splice(deleteTheContact, 1);
                const maxW = document.documentElement.clientWidth;
                if(maxW <= 768)
                    this.closeChat();
                else{
                    this.chat = this.contacts[0];
                    if(this.contacts.length == 0)
                        this.chat = null;
                }
                }, 10);
            },
            openBox : function(element) {
                if (element.style.display == "block") {
                    element.style.display = "none";
                    element.classList.remove('visible');
                } else {
                    element.style.display = "block";
                    setTimeout(() => {
                        element.className += ' visible';
                    }, 0);
                }
            },
        },
        updated: function () {
            //rimuove il menu-box al cambio chat
            let menu = document.getElementsByClassName('message-menu');
            for (let i = 0; i < menu.length; i++) {
                menu[i].style.display = "none";
                menu[i].classList.remove('visible');
            }
            this.dateToday = dayjs();                
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
                    if(document.getElementById('settings-box').classList.contains('visible')){
                        document.getElementById('settings-box').classList.remove('visible');
                        document.getElementById('settings-box').style.display ="none";
                    }
                    if(document.getElementById('chat-settings-box').classList.contains('visible')){
                        document.getElementById('chat-settings-box').classList.remove('visible');
                        document.getElementById('chat-settings-box').style.display ="none";
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