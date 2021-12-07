const Web3 = require('web3');
let web3 = new Web3("ws://localhost:8545");

const Factory = artifacts.require('SVSwapV2Factory.sol');
const Router = artifacts.require('SVSwapV2Router02.sol');
const FDAIToken = artifacts.require('FDAIToken.sol');
const FUSDCToken = artifacts.require('FUSDCToken.sol');
const FUSDTToken = artifacts.require('FUSDTToken.sol');
const WETH = artifacts.require('WETH.sol');

module.exports = async (deployer, _network, accounts) => {
  await deployer.deploy(Factory, accounts[0]);
  const factory = await Factory.deployed();
  const weth = await WETH.deployed();

  await deployer.deploy(WETH);
  await deployer.deploy(Router, factory.address, weth.address);
  const router = await Router.deployed();

  await deployer.deploy(FDAIToken);
  await deployer.deploy(FUSDCToken);
  // await deployer.deploy(FUSDTToken);

  const fDAIToken = await FDAIToken.deployed();
  const fUSDCToken = await FUSDCToken.deployed();
  // const fUSDTToken = await FUSDTToken.deployed();

  await factory.createPair(fDAIToken.address, weth.address);
  await factory.createPair(fUSDCToken.address, weth.address);
  // await factory.createPair(fUSDTToken.address, weth.address);

  const fDAIpairAddress = await factory.getPair(fDAIToken.address, weth.address)
  const fUSDCpairAddress = await factory.getPair(fUSDCToken.address, weth.address)
  // const fUSDTpairAddress = await factory.getPair(fUSDTToken.address, weth.address)


  await fDAIToken.mint(accounts[0], web3.utils.toWei('1000000'))
  await fDAIToken.approve(router.address, web3.utils.toWei('10000'))
  await router.addLiquidityETH(fDAIToken.address, web3.utils.toWei('10000'), 0, 0, accounts[0], 1638901000, { value: web3.utils.toWei('1') });

  await fUSDCToken.mint(accounts[0], web3.utils.toWei('1000000'))
  await fUSDCToken.approve(router.address, web3.utils.toWei('10000'))
  await router.addLiquidityETH(fUSDCToken.address, web3.utils.toWei('10000'), 0, 0, accounts[0], 1638901000, { value: web3.utils.toWei('1') });

  // await fDAIToken.approve(router.address, web3.utils.toWei('10'))
  // await fUSDCToken.approve(router.address, web3.utils.toWei('10'))
  // await router.swapExactTokensForTokens(
  //   web3.utils.toWei('10'),
  //   0,
  //   [fDAIToken.address, weth.address, fUSDCToken.address],
  //   accounts[0],
  //   1838901000,
  // );

  await router
    .connect(accounts[0])
    .swapETHForExactTokens(
      web3.utils.toWei('10'),
      [weth.address, fDAIToken.address],
      accounts[0],
      1838497206,
      { value: web3.utils.toWei('20') }
    );


};
