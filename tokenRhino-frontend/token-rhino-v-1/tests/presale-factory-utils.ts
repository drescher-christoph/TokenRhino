import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt } from "@graphprotocol/graph-ts"
import {
  CreateFeePaid,
  CreateFeeUpdated,
  FeeReceived,
  FeesWithdrawn,
  OwnershipTransferred,
  PolicyUpdated,
  PresaleCreated
} from "../generated/PresaleFactory/PresaleFactory"

export function createCreateFeePaidEvent(
  creator: Address,
  createFeeWei: BigInt
): CreateFeePaid {
  let createFeePaidEvent = changetype<CreateFeePaid>(newMockEvent())

  createFeePaidEvent.parameters = new Array()

  createFeePaidEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  createFeePaidEvent.parameters.push(
    new ethereum.EventParam(
      "createFeeWei",
      ethereum.Value.fromUnsignedBigInt(createFeeWei)
    )
  )

  return createFeePaidEvent
}

export function createCreateFeeUpdatedEvent(newFee: BigInt): CreateFeeUpdated {
  let createFeeUpdatedEvent = changetype<CreateFeeUpdated>(newMockEvent())

  createFeeUpdatedEvent.parameters = new Array()

  createFeeUpdatedEvent.parameters.push(
    new ethereum.EventParam("newFee", ethereum.Value.fromUnsignedBigInt(newFee))
  )

  return createFeeUpdatedEvent
}

export function createFeeReceivedEvent(
  presale: Address,
  amount: BigInt
): FeeReceived {
  let feeReceivedEvent = changetype<FeeReceived>(newMockEvent())

  feeReceivedEvent.parameters = new Array()

  feeReceivedEvent.parameters.push(
    new ethereum.EventParam("presale", ethereum.Value.fromAddress(presale))
  )
  feeReceivedEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feeReceivedEvent
}

export function createFeesWithdrawnEvent(
  to: Address,
  amount: BigInt
): FeesWithdrawn {
  let feesWithdrawnEvent = changetype<FeesWithdrawn>(newMockEvent())

  feesWithdrawnEvent.parameters = new Array()

  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  feesWithdrawnEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return feesWithdrawnEvent
}

export function createOwnershipTransferredEvent(
  previousOwner: Address,
  newOwner: Address
): OwnershipTransferred {
  let ownershipTransferredEvent =
    changetype<OwnershipTransferred>(newMockEvent())

  ownershipTransferredEvent.parameters = new Array()

  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam(
      "previousOwner",
      ethereum.Value.fromAddress(previousOwner)
    )
  )
  ownershipTransferredEvent.parameters.push(
    new ethereum.EventParam("newOwner", ethereum.Value.fromAddress(newOwner))
  )

  return ownershipTransferredEvent
}

export function createPolicyUpdatedEvent(): PolicyUpdated {
  let policyUpdatedEvent = changetype<PolicyUpdated>(newMockEvent())

  policyUpdatedEvent.parameters = new Array()

  return policyUpdatedEvent
}

export function createPresaleCreatedEvent(
  creator: Address,
  presale: Address,
  token: Address
): PresaleCreated {
  let presaleCreatedEvent = changetype<PresaleCreated>(newMockEvent())

  presaleCreatedEvent.parameters = new Array()

  presaleCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  presaleCreatedEvent.parameters.push(
    new ethereum.EventParam("presale", ethereum.Value.fromAddress(presale))
  )
  presaleCreatedEvent.parameters.push(
    new ethereum.EventParam("token", ethereum.Value.fromAddress(token))
  )

  return presaleCreatedEvent
}
