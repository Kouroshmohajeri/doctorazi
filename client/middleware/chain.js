export function chain(functions, index = 0) {
    const current = functions[index];
  
    if (current) {
      const next = chain(functions, index + 1);
      return function (request) {
        return Promise.resolve(current(request)) // Ensure a Promise is returned
          .then((response) => (response ? response : next(request)))
          .catch((error) => {
            console.error('Error in middleware chain:', error);
            return next(request);
          });
      };
    }
  
    return function (request) {
      return Promise.resolve(NextResponse.next()); // Also wrap NextResponse.next() in a Promise
    };
  }
  