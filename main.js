let allContacts = [
    {
        name: 'Michele',
        avatar: '_1',
        visible: true,
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
                date: '10/01/2020 16:15:22',
                text: 'Tutto fatto!',
                status: 'received'
            }
        ],
    },
    {
        name: 'Fabio',
        avatar: '_2',
        visible: true,
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
                date: '20/03/2020 16:35:00',
                text: 'Mi piacerebbe ma devo andare a fare la spesa.',
                status: 'sent'
            }
        ],
    },
    {
        name: 'Samuele',
        avatar: '_3',
        visible: true,
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
                date: '28/03/2020 16:15:22',
                text: 'Ah scusa!',
                status: 'received'
            }
        ],
    },
    {
        name: 'Luisa',
        avatar: '_4',
        visible: true,
        messages: [
        ], //test su nuova chat
    },
]


var app = new Vue(
    {
        el: "#root",
        data: {
            contacts : allContacts,
            chat : allContacts[0],
            inputText : null,
            searchBar : null,
        },
        methods: {
            openChat : function(elemento){
                console.log(elemento.name);
                this.chat = elemento;
            },
            writeMessage : function(elemento){
                console.log(this.inputText);
                let newMessage = {
                    date: '10/01/2020 15:50:00',
                    text: this.inputText,
                    status: 'sent'
                };
                elemento.messages.push(newMessage);
                this.inputText = "";
                this.reply(elemento);
            },
            reply : function(elemento){
                    setTimeout(() => {
                        let newMessage = {
                            date: '10/01/2020 15:50:00',
                            text: 'ok',
                            status: 'received'
                        };
                        elemento.messages.push(newMessage);
                    }, 1500);
            },
            searchContact : function(){
                let searchTemp = this.searchBar.toLowerCase();
                searchTemp = searchTemp.replace(/\s/g, '');

                for(let i=0; i<this.contacts.length; i++)
                    this.contacts[i].visible = true;
                
                if(this.searchBar != null && this.searchBar != "" )
                    for(let i=0; i<this.contacts.length; i++)
                        if(!(this.contacts[i].name.toLowerCase()).includes(searchTemp))
                            this.contacts[i].visible = false;
            },
            showMessageMenu : function(index,hover){
                let menu = document.getElementsByClassName('message-button');
                if(hover)
                    menu[index].style.display ="block";
                else
                    menu[index].style.display ="none";
            },
            messageMenu : function(index){
                let menu = document.getElementsByClassName('message-menu');
                    if(menu[index].style.display == "block")
                        menu[index].style.display ="none";
                    else
                        menu[index].style.display ="block";
            },
            deleteMessage : function(mess,index){
                let boh;
                for(let i=0; i<this.contacts.length; i++){
                    boh = this.contacts[i].messages.indexOf(mess);
                    if(boh != -1){
                        boh = i;
                        break;
                    }
                }
                console.log(BroadcastChannel);
                console.log(mess,index);
                this.contacts[boh].messages.splice(index,1);
                this.messageMenu(index);
            }
        }
    }
);