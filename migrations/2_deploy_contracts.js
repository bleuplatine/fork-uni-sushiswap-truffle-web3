const Web3 = require('web3');
let web3 = new Web3("ws://localhost:8545");

const Factory = artifacts.require('ForkUniswapV2/SVSwapV2Factory.sol');
const Router = artifacts.require('ForkUniswapV2/SVSwapV2Router02.sol');
const Pair = artifacts.require('ForkUniswapV2/SVSwapV2Pair.sol');
const FDAIToken = artifacts.require('ForkUniswapV2/FDAIToken.sol');
const FUSDCToken = artifacts.require('ForkUniswapV2/FUSDCToken.sol');
const FUSDTToken = artifacts.require('ForkUniswapV2/FUSDTToken.sol');
const WETH = artifacts.require('ForkUniswapV2/WETH.sol');

const MasterChef = artifacts.require('ForkSushiswap/MasterChef.sol');

module.exports = async (deployer, _network, accounts) => {

    
    try {
        // ForkUniswapV2

        await deployer.deploy(FDAIToken);
        await deployer.deploy(FUSDCToken);
        await deployer.deploy(FUSDTToken);
        await deployer.deploy(WETH);

        const fDAIToken = await FDAIToken.deployed();
        const fUSDCToken = await FUSDCToken.deployed();
        const fUSDTToken = await FUSDTToken.deployed();
        const weth = await WETH.deployed();
        console.log('fDAIToken.address :>> ', fDAIToken.address);
        console.log('fUSDCToken.address :>> ', fUSDCToken.address);
        console.log('weth.address :>> ', weth.address);

        await deployer.deploy(Factory, accounts[0]);
        const factory = await Factory.deployed();

        await deployer.deploy(Router, factory.address, weth.address);
        const router = await Router.deployed();
        console.log('factory.address :>> ', factory.address);
        console.log('router.address :>> ', router.address);


        await factory.createPair(fDAIToken.address, weth.address);
        await factory.createPair(fUSDCToken.address, weth.address);
        await factory.createPair(fUSDTToken.address, weth.address);

        const fDAIpairAddress = await factory.getPair(fDAIToken.address, weth.address)
        const fUSDCpairAddress = await factory.getPair(fUSDCToken.address, weth.address)
        const fUSDTpairAddress = await factory.getPair(fUSDTToken.address, weth.address)
        const fDAIContract = new web3.eth.Contract(Pair.abi, fDAIpairAddress)
        const fUSDCContract = new web3.eth.Contract(Pair.abi, fUSDCpairAddress)
        const fUSDTContract = new web3.eth.Contract(Pair.abi, fUSDTpairAddress)
        console.log('fDAIpairAddress :>> ', fDAIpairAddress);
        console.log('fUSDCpairAddress :>> ', fUSDCpairAddress);


        await fDAIToken.mint(accounts[0], web3.utils.toWei('1000000'))
        await fUSDCToken.mint(accounts[0], web3.utils.toWei('1000000'))
        await fUSDTToken.mint(accounts[0], web3.utils.toWei('1000000'))
        let balanceOfDai = await fDAIToken.balanceOf(accounts[0])
        let balanceOfUSDC = await fUSDCToken.balanceOf(accounts[0])
        let balanceOfUSDT = await fUSDTToken.balanceOf(accounts[0])
        console.log('balanceOfDai :>> ', web3.utils.fromWei(balanceOfDai));
        console.log('balanceOfUSDC :>> ', web3.utils.fromWei(balanceOfUSDC));


        await fDAIToken.approve(router.address, web3.utils.toWei('10000'))
        await fUSDCToken.approve(router.address, web3.utils.toWei('10000'))
        await fUSDTToken.approve(router.address, web3.utils.toWei('10000'))

        await router.addLiquidityETH(fDAIToken.address, web3.utils.toWei('10000'), '0', '0', accounts[0], 1838901000, { value: web3.utils.toWei('10') });
        await router.addLiquidityETH(fUSDCToken.address, web3.utils.toWei('10000'), '0', '0', accounts[0], 1838901000, { value: web3.utils.toWei('10') });
        await router.addLiquidityETH(fUSDTToken.address, web3.utils.toWei('10000'), '0', '0', accounts[0], 1838901000, { value: web3.utils.toWei('1') });
        let fDAIWethReserves = await fDAIContract.methods.getReserves().call()
        console.log("Before SWAP :")
        console.log('fDAIWethReserves - fDAIToken :>> ', web3.utils.fromWei(fDAIWethReserves["0"]));
        console.log('fDAIWethReserves - WETH :>> ', web3.utils.fromWei(fDAIWethReserves["1"]));
        
        await fDAIToken.approve(router.address, web3.utils.toWei('5'))
        await fUSDCToken.approve(router.address, web3.utils.toWei('5'))
        await router.swapExactTokensForTokens(web3.utils.toWei('5'), '1', [fDAIToken.address, weth.address, fUSDCToken.address], accounts[0], 1838901000);
        
        fDAIWethReserves = await fDAIContract.methods.getReserves().call()
        console.log("After SWAP :")
        console.log('fDAIWethReserves - fDAIToken :>> ', web3.utils.fromWei(fDAIWethReserves["0"]));
        console.log('fDAIWethReserves - WETH :>> ', web3.utils.fromWei(fDAIWethReserves["1"]));

        // ForkSushiswap
        

    } catch (error) {
        console.log("ForkUniswapV2 Error >>", error)
    }


};
