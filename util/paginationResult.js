const getPaginatedResult = (data, page, limit) => {
  let paginatedResponse = {};
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;

  paginatedResponse.totalRecords = data.length;
  paginatedResponse.currentPage = page;
  paginatedResponse.previousPage = startIndex > 0 ? page - 1 : null;
  paginatedResponse.nextPage = endIndex < data.length ? page + 1 : null;
  if (data.length <= limit) {
    paginatedResponse.lastPage = page;
  } else {
    paginatedResponse.lastPage =
      data.length % limit === 0
        ? Math.floor(data.length / limit)
        : Math.floor(data.length / limit + 1);
  }
  paginatedResponse.results = data.slice(startIndex, endIndex);

  return paginatedResponse;
};
// sorting helpers functions
const getsortingResult = (data, sortBy, orderBy) => {
  if (sortBy === "episode_id" && orderBy === "desc") {
    return data.sort((a, b) => {
      return b.episode_id - a.episode_id;
    });
    // sort by episode_id asc
  } else if (sortBy === "episode_id" && orderBy === "asc") {
    return data.sort((a, b) => {
      return a.episode_id - b.episode_id;
    });
    // sort by title acs
  } else if (sortBy === "title" && orderBy === "acs") {
    return data.sort((a, b) => {
      return a.title > b.title ? 1 : b.title > a.title ? -1 : 0;
    });
    // sort by title desc
  } else if (sortBy === "title" && orderBy === "desc") {
    return data.sort((a, b) =>
      b.title > a.title ? 1 : a.title > b.title ? -1 : 0
    );
  } else if (sortBy === "id" && orderBy === "desc") {
    return data.sort((a, b) => {
      return b.id - a.id;
    });
  } else {
    return data.sort((a, b) => {
      return a.id - b.id;
    });
  }
};

module.exports = {
  getPaginatedResult,
  getsortingResult,
};
