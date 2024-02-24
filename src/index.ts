const inquirer = require('inquirer');
const consola = require('consola')

enum Action {
    List = "list",
    Add = "add",
    Remove = "remove",
    Quit = "quit"
}
  
type InquirerAnswers = {
    action: Action
}  

enum MessageVariant {
    Success = "success",
    Error = "error",
    Info = "info"
}

interface User {
    name: string;
    age: number;
}

class Message {
    constructor(private content: string) {
        //this.content = content;
    }

    show(): void {
        console.log(this.content);
    }

    capitalize(): void{
        this.content = this.content.charAt(0).toUpperCase() + this.content.slice(1).toLowerCase();
    }

    toUpperCase(): void{
        this.content = this.content.toUpperCase();
    }

    toLowerCase(){
        this.content = this.content.toLowerCase();
    }

    static showColorized(variant: MessageVariant, text: string): void {
        if (variant === MessageVariant.Success) consola.success(text)
        if (variant === MessageVariant.Error) consola.error(text)
        if (variant === MessageVariant.Info) consola.info(text)
    }
}

class UsersData implements User {

    name: string;
    age: number;
    data: User[] = [];

    showAll(): void {
        Message.showColorized(MessageVariant.Info, "Users data")
        this.data.length > 0 ? (console.table(this.data)) : (console.log("No data"));
    }

    add(user: User): void {
        if( user.name.length > 0 && user.age > 0) {
        this.data.push(user);
        Message.showColorized(MessageVariant.Success, "User has been successfully added!");
        } else {
        Message.showColorized(MessageVariant.Error, "Wrong data!");
        }
      }

    remove(name: string): void {
        if(this.data.find((user) => user.name === name)) {
        this.data = this.data.filter((user) => user.name !== name);
        Message.showColorized(MessageVariant.Success, "User has been successfully removed!");
        } else {
        Message.showColorized(MessageVariant.Error, "User not found!");
        }
      }
}

const users = new UsersData();
console.log("\n");
console.info("???? Welcome to the UsersApp!");
console.log("====================================");
Message.showColorized(MessageVariant.Info, "Available actions");
console.log("\n");
console.log("list – show all users");
console.log("add – add new user to the list");
console.log("remove – remove user from the list");
console.log("quit – quit the app");
console.log("\n");

const startApp = () => {
    inquirer.prompt([{
      name: 'action',
      type: 'input',
      message: 'How can I help you?',
    }]).then(async (answers: InquirerAnswers) => {
      switch (answers.action) {
        
        case Action.List:
          users.showAll();
          break;
        
          case Action.Add:
          const user = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }, {
            name: 'age',
            type: 'number',
            message: 'Enter age',
          }]);
          users.add(user);
          break;
       
          case Action.Remove:
          const name = await inquirer.prompt([{
            name: 'name',
            type: 'input',
            message: 'Enter name',
          }]);
          users.remove(name.name);
          break;
        
          case Action.Quit:
            Message.showColorized(MessageVariant.Info, "Bye bye!");
          return;

          default:
            Message.showColorized(MessageVariant.Error, 'Command not found.');
      }
  
      startApp();
    });
  }

  startApp();