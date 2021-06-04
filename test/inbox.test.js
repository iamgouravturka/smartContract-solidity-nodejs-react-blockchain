const assert = require("assert");
const ganache = require('ganache-cli');
const Web3 = require("web3");
const { interface , bytecode } = require('../compile')

const web3 = new Web3(ganache.provider());

let accounts;
let inbox;
const intial_message = "Pardeep";
const update_message = "Pardeep Kumar";

beforeEach(async () => {
    // get list of all accounts 
    accounts = await web3.eth.getAccounts();

    //use one of account to deploy the contract
    inbox = await new web3.eth.Contract(JSON.parse(interface)).deploy({data: bytecode, arguments: [intial_message]}).send({from : accounts[0], gas: '1000000'})

})

describe('Inbox', () => {
    it("deploys a contract", () => {
        assert.ok(inbox.options.address);
    });

    it("has a default message" , async () => {
        const message = await inbox.methods.message().call();
        assert.equal(message, intial_message);
    });

    it("Can change the message", async() => {
        await inbox.methods.setMessage(update_message).send({ from: accounts[0]});
        const updatedMessage = await inbox.methods.getMessage().call();
        assert.equal(updatedMessage, update_message);
    })
})