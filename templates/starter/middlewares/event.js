'use strict';

export const prevent = (next) => (event) => {
    event.preventDefault();
    event.stopPropagation();
    next(event);
};