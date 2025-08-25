 const initPayment = async (rideId: string) => {
  return rideId;
  
};

const successPayment = async(query: Record<string, string>) => {
    return query;
}

const failPayment = async(query: Record<string, string>) => {
    return query;
}

const cancelPayment = async(query: Record<string, string>) =>{
    return query
}


export const PaymentServices = {
    initPayment, successPayment, failPayment, cancelPayment
}