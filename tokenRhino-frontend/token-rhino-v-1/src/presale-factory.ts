import {
  CreateFeePaid as CreateFeePaidEvent,
  CreateFeeUpdated as CreateFeeUpdatedEvent,
  FeeReceived as FeeReceivedEvent,
  FeesWithdrawn as FeesWithdrawnEvent,
  OwnershipTransferred as OwnershipTransferredEvent,
  PolicyUpdated as PolicyUpdatedEvent,
  PresaleCreated as PresaleCreatedEvent
} from "../generated/PresaleFactory/PresaleFactory"
import {
  CreateFeePaid,
  CreateFeeUpdated,
  FeeReceived,
  FeesWithdrawn,
  OwnershipTransferred,
  PolicyUpdated,
  PresaleCreated,
  Presale,
  Token
} from "../generated/schema"
import { ERC20 } from "../generated/PresaleFactory/ERC20"
import { Presale as PresaleTemplate } from "../generated/PresaleFactory/Presale"
import { Bytes, Address } from "@graphprotocol/graph-ts"

export function handleCreateFeePaid(event: CreateFeePaidEvent): void {
  let entity = new CreateFeePaid(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.createFeeWei = event.params.createFeeWei

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleCreateFeeUpdated(event: CreateFeeUpdatedEvent): void {
  let entity = new CreateFeeUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.newFee = event.params.newFee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeeReceived(event: FeeReceivedEvent): void {
  let entity = new FeeReceived(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.presale = event.params.presale
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleFeesWithdrawn(event: FeesWithdrawnEvent): void {
  let entity = new FeesWithdrawn(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.to = event.params.to
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleOwnershipTransferred(
  event: OwnershipTransferredEvent
): void {
  let entity = new OwnershipTransferred(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.previousOwner = event.params.previousOwner
  entity.newOwner = event.params.newOwner

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handlePolicyUpdated(event: PolicyUpdatedEvent): void {
  let entity = new PolicyUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

function getOrCreateToken(tokenAddress: Bytes): Token {
  let token = Token.load(tokenAddress)
  if (token == null) {
    token = new Token(tokenAddress)

    let tokenAddressAsAddress = Address.fromBytes(tokenAddress)
    
    // ERC20 Contract binden und Token-Infos abrufen
    let erc20 = ERC20.bind(tokenAddressAsAddress)
    
    // Try-Catch für fehlende ERC20 Metadata Funktionen
    let nameResult = erc20.try_name()
    if (!nameResult.reverted) {
      token.name = nameResult.value
    } else {
      token.name = "Unknown"
    }
    
    let symbolResult = erc20.try_symbol()
    if (!symbolResult.reverted) {
      token.symbol = symbolResult.value
    } else {
      token.symbol = "UNKN"
    }
    
    let decimalsResult = erc20.try_decimals()
    if (!decimalsResult.reverted) {
      token.decimals = decimalsResult.value
    } else {
      token.decimals = 18
    }
    
    token.save()
  }
  return token
}

export function handlePresaleCreated(event: PresaleCreatedEvent): void {
  let entity = new PresaleCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.creator = event.params.creator
  entity.presale = event.params.presale
  entity.token = event.params.token

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash
  entity.save()

  // Token-Infos abrufen und speichern
  let token = getOrCreateToken(event.params.token)

  let presale = new Presale(event.params.presale)
  presale.creator = event.params.creator
  presale.token = event.params.token
  presale.presale = event.params.presale
  presale.createdAt = event.block.timestamp
  presale.factoryEvent = entity.id

  if (token !== null) {
    presale.tokenInfo = token.id
  }

  // Starten Sie das Presale-Template, um Ereignisse von diesem Presale zu überwachen
  let presaleContract = PresaleTemplate.bind(event.params.presale)

  let tokensForSaleResult = presaleContract.try_i_tokensForSaleUnits()
  if (!tokensForSaleResult.reverted) {
    presale.tokensForSaleUnits = tokensForSaleResult.value
  }

  let tokensPerEthResult = presaleContract.try_i_TOKENS_PER_ETH()
  if (!tokensPerEthResult.reverted) {
    presale.tokensPerEth = tokensPerEthResult.value
  }


  let startResult = presaleContract.try_i_startTime()
  if (!startResult.reverted) {
    presale.startTime = startResult.value
  }

  let endResult = presaleContract.try_i_endTime()
  if (!endResult.reverted) {
    presale.endTime = endResult.value
  }

  let hardcapResult = presaleContract.try_i_hardCapWei()
  if (!hardcapResult.reverted) {
    presale.hardCap = hardcapResult.value
  }

  let softcapResult = presaleContract.try_i_softCapWei()
  if (!softcapResult.reverted) {
    presale.softCap = softcapResult.value
  }

  let minContrib = presaleContract.try_i_minContributionWei()
  if (!minContrib.reverted) {
    presale.minContribution = minContrib.value
  }

  let maxContrib = presaleContract.try_i_maxContributionWei()
  if (!maxContrib.reverted) {
    presale.maxContribution = maxContrib.value
  }

  presale.save()
}
