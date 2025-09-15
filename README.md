# 🦏 TokenRhino – The Decentralized Presale Launchpad

**TokenRhino** is a self-service token presale launchpad that enables creators to launch, manage, and finalize token presales in a fully decentralized and permissionless way.

## Live-Preview: https://token-rhino.vercel.app/ ##

---

## 🚀 Features

- ✅ **Fully On-Chain** Presale logic (Factory + Clone Contracts)
- 🧱 **Clone Pattern** for scalable deployments
- 📜 **Customizable Token Presale Parameters**
- 📦 **Automatic Presale Tracking & Management**
- 🧑‍💻 **Frontend DApp** to create, monitor and participate in presales
- 🔐 **Non-custodial, secure and audited contract architecture**
- 📊 **On-Chain Stats & Analytics** (planned)
- 🌐 **Mobile-Optimized UI** built with **React + TailwindCSS**

---

## 🔧 Tech Stack

| Layer      | Stack                                                                 |
|------------|-----------------------------------------------------------------------|
| Blockchain | Solidity, Foundry, Ethereum Sepolia Testnet                          |
| Frontend   | React.js, Vite, Tailwind CSS, Ether.js                                |
| Storage    | IPFS via Pinata (for token logos and metadata)                       |
| Backend    | No backend – 100% decentralized smart contract logic                 |
| Subgraph   | [The Graph Protocol](https://thegraph.com/) *(in the working)*              |
| Wallet     | MetaMask, WalletConnect (via Wagmi) *(planned)*                      |

---

## 📝 How It Works

1. **Creator launches a Presale**
   - Deploys a lightweight clone contract via the `PresaleFactory`
   - Sets parameters (token address, price, hardcap/softcap, vesting, etc.)

2. **Users invest in ETH**
   - Contributions tracked per wallet
   - Token claimable after finalization or vesting

3. **Creator finalizes & withdraws**
   - Once presale ends (time or hardcap), creator can finalize and withdraw ETH
   - Users can then **claim** their allocated tokens

4. *(Future)*: On-chain **stats, filters, trending sales**, and more

---

## 🧪 Local Development

### 🔨 Contracts (Foundry)

```bash
cd backend
forge install
forge build
forge test