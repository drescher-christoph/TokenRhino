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
  Presale
} from "../generated/schema"

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

  let presale = new Presale(event.params.presale)
  presale.creator = event.params.creator
  presale.token = event.params.token
  presale.presale = event.params.presale
  presale.createdAt = event.block.timestamp
  presale.factoryEvent = entity.id
  presale.save()
}
