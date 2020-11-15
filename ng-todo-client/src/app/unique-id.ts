

export function generateUniqueId(){
    return [Date.now(),Math.random()].join();
}