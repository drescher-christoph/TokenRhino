import {
  TokensBought as TokensBoughtEvent,
  TokensClaimed as TokensClaimedEvent,
  TokensRefunded as TokensRefundedEvent
} from "../generated/templates/PresaleTemplate/Presale"
import { 
  Investment, 
  User, 
  Presale, 
  Claim, 
  Refund 
} from "../generated/schema"
import { BigInt, BigDecimal, Bytes, log } from "@graphprotocol/graph-ts"

// Füge diese Funktion hinzu:
function getInvestmentStatus(presale: Presale): string {
  if (presale.finalized) {
    return "CLAIMABLE";
  } else if (presale.state == 3) { // FAILED state
    return "REFUNDABLE";
  } else {
    return "ACTIVE";
  }
}


export function handleTokensBought(event: TokensBoughtEvent): void {
  
  log.info("TokensBought event received: buyer={}, amountWei={}", [
    event.params.buyer.toHexString(),
    event.params.amountWei.toString()
  ])

  let userId = event.params.buyer
  let user = User.load(userId)

  log.info("User loaded: {}", [user ? user.id.toHexString() : "null"])

  if (user == null) {
    log.info("Creating new user: {}", [userId.toHexString()])
    user = new User(userId)
    user.totalInvested = BigInt.zero()
    user.save()
    log.info("User created successfully: {}", [userId.toHexString()])
  }

  // Presale laden
  let presale = Presale.load(event.address)
  if (presale == null) return

  // Investment erstellen
  let investmentId = event.transaction.hash.concatI32(event.logIndex.toI32())
  let investment = new Investment(investmentId)
  
  investment.user = user.id
  investment.presale = presale.id
  investment.amountWei = event.params.amountWei
  investment.amountEth = event.params.amountWei.toBigDecimal().div(BigDecimal.fromString('1e18'))
  investment.tokensBought = event.params.amountTokens
  investment.timestamp = event.block.timestamp
  investment.blockNumber = event.block.number
  investment.claimed = false
  investment.refunded = false
  investment.status = getInvestmentStatus(presale);
  
  investment.save()

  // User total invested aktualisieren
  user.totalInvested = user.totalInvested.plus(event.params.amountWei)
  user.save()

  // Presale Statistiken aktualisieren
  presale.totalInvested = presale.totalInvested.plus(event.params.amountWei)
  
  // Prüfen ob dieser User neu ist für diesen Presale
  let existingInvestments = presale.investments.load()
  let isNewInvestor = true
  for (let i = 0; i < existingInvestments.length; i++) {
    if (existingInvestments[i].user == user.id) {
      isNewInvestor = false
      break
    }
  }
  
  if (isNewInvestor) {
    presale.totalInvestors = presale.totalInvestors + 1
  }
  
  presale.save()
}

export function handleTokensClaimed(event: TokensClaimedEvent): void {
  // Claim-Eintrag erstellen
  let claimId = event.transaction.hash.concatI32(event.logIndex.toI32())
  let claim = new Claim(claimId)
  
  claim.user = event.params.user
  claim.presale = event.address
  claim.amountTokens = event.params.amountTokens
  claim.timestamp = event.block.timestamp
  claim.blockNumber = event.block.number
  
  claim.save()

  // Investment als claimed markieren
  // Hier müssten wir das entsprechende Investment finden und updaten
  // Dies erfordert eine Logik zum Finden des Investments basierend auf buyer und presale
}

export function handleRefunded(event: TokensRefundedEvent): void {
  // Refund-Eintrag erstellen
  let refundId = event.transaction.hash.concatI32(event.logIndex.toI32())
  let refund = new Refund(refundId)
  
  refund.user = event.params.user
  refund.presale = event.address
  refund.amountTokens = event.params.amountTokens
  refund.timestamp = event.block.timestamp
  refund.blockNumber = event.block.number
  
  refund.save()

  // Investment als refunded markieren
  // Hier müssten wir das entsprechende Investment finden und updaten
}