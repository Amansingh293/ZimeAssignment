import { Button, Dropdown, Input, Pagination, Table, message } from "antd";
import React, { useEffect, useState } from "react";
import { DownOutlined } from "@ant-design/icons";
import { Space, Typography } from "antd";
import Tags from "../components/Tags";
import Search from "antd/es/transfer/search";
import { useLocation, useNavigate } from "react-router";

export const TableSearch = () => {
  // States

  const navigate = useNavigate();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const skipQuery = searchParams.get("skip");
  const limitQuery = searchParams.get("limit");
  const searchQuery = searchParams.get("search");
  const filtersQuery = searchParams.get("filters");

  const [fetchedData, setFetchedData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [items, setItems] = useState([]);
  const [searchValue, setSearchValue] = useState(
    searchQuery ? searchQuery : ""
  );
  const [selectedFilter, setSelectedFilter] = useState(
    !filtersQuery ? [] : filtersQuery.split(",")
  );
  const [searched, setSearched] = useState(false);

  const [skip, setSkip] = useState(skipQuery ? skipQuery : 0);
  const [limit, setLimit] = useState(10);
  const [tagsAvailable, setTagsAvailable] = useState([]);

  const [loader, setLoader] = useState(false);
  // functions

  // search matching function
  const searchMatching = () => {
    let searchFilter = [];
    setFilteredData(fetchedData);
    setSelectedFilter([]);

    if (searchValue === "") {
      setFilteredData((filteredData) => fetchedData);
      filterHandler();
      return;
    }

    (filteredData.length === 0 ? fetchedData : filteredData).forEach((obj) => {
      if (obj.body.includes(searchValue)) {
        searchFilter.push(obj);
      }
    });

    if (searchFilter.length === 0) {
      message.info("No Search Found !! Showing All Data");
      setFilteredData((filteredData) => fetchedData);
    } else {
      setFilteredData((filteredData) => searchFilter);
    }
  };

  // data fetching function
  const dataFetcher = async () => {
    setLoader(true);
    try {
      const response = await fetch(
        `https://dummyjson.com/posts?skip=${skip}&limit=${limit}`
      );
      const result = await response.json();
      let tagsArray = [];

      result.posts.forEach((element) => {
        element.tags.forEach((ele) => {
          if (!tagsArray.includes(ele)) {
            tagsArray.push(ele);
          }
        });
      });

      setFetchedData((fetchedData) => result.posts);

      setTagsAvailable((tagsAvailable) => tagsArray);

      let itemsAvailable = tagsArray.map((ele, i) => {
        return {
          key: i,
          label: ele,
        };
      });

      itemsAvailable.unshift({ key: "x", label: "All" });

      setItems((items) => itemsAvailable);

      // setFilteredData(result.posts);

      setLoader(false);
    } catch (err) {
      message.error("Error fetching data");
      console.log(err.message);
    }
  };
  // pagination handling function
  const handlePagination = (e) => {
    setSkip((skip) => e * 10 - 10);
    setLimit((limit) => 10);
  };

  // filter selection handler function
  const selectHandler = (e) => {
    if (tagsAvailable[e.key] === undefined) {
      setFilteredData((filteredData) => []);
      setSelectedFilter((selectedFilter) => []);
      return;
    }

    if (!selectedFilter?.includes(tagsAvailable[e.key])) {
      setSelectedFilter((selectedFilter) => [
        ...selectedFilter,
        tagsAvailable[e.key],
      ]);
    }
  };

  // filter handling function
  const filterHandler = () => {

    setFilteredData(fetchedData);
    setSearchValue("");
    if (selectedFilter.length === 0) {
      setFilteredData((filtered) => []);
      return;
    }
    let filtered = [];

    fetchedData.forEach((obj) => {
      let count = 0;
      selectedFilter.forEach((ele) => {
        if (obj.tags.includes(ele)) {
          count++;
        }
      });
      if (count === selectedFilter.length) {
        filtered.push(obj);
      }
    });

    if (filtered.length === 0) {
      message.info("No Filters Found !! Showing All Data");
    }
    setFilteredData(filtered);
  };

  // on searching field updator function
  const onSearch = (e) => {
    setSearchValue(e.target.value);
  };

  //  Effects

  // Effect for URL Persistence
  useEffect(() => {
    if (!selectedFilter.length && !searchValue) {
      navigate(`/?skip=${skip}&limit=${limit}`);
    } else if (!selectedFilter.length && searchValue) {
      navigate(`/?skip=${skip}&limit=${limit}&search=${searchValue}`);
    } else if (selectedFilter.length && !searchValue) {
      navigate(
        `/?skip=${skip}&limit=${limit}&filters=${selectedFilter.join(",")}`
      );
    } else {
      navigate(
        `/?skip=${skip}&limit=${limit}&filters=${selectedFilter.join(
          ","
        )}&search=${searchValue}`
      );
    }
  }, [skip, limit, selectedFilter, searchValue]);

  // effect for filteration handler
  useEffect(() => {
    filterHandler();
  }, [selectedFilter, fetchedData]);

  // effect for search matching
  useEffect(() => {
    searchMatching();
  }, [fetchedData, searched]);

  // effect for data fetching
  useEffect(() => {
    dataFetcher();
  }, [skip]);

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
    },
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
    },
    {
      title: "Body",
      dataIndex: "body",
      key: "body",
    },
    {
      title: "Reactions",
      dataIndex: "reactions",
      key: "reactions",
    },
    {
      title: "Tags",
      dataIndex: "tags",
      key: "tag",
      render: (_, rowData) => (
        <div className=" text-[1rem]">{rowData.tags.join(" , ")}</div>
      ),
    },
  ];

  return (
    <>
      {loader ? (
        <div className="loaderParent">
          <div className="loader"></div>
        </div>
      ) : (
        <div className="p-8 rounded-lg border-black flex flex-col justify-around gap-4 ">
          <div className="flex justify-start items-center gap-1">
            <Input
              value={searchValue}
              placeholder="input search text"
              onChange={onSearch}
              style={{
                width: 200,
              }}
            />
            <Button
              className="flex justify-center items-center"
              onClick={() => setSearched(!searched)}
            >
              Search
            </Button>
          </div>
          <div className="flex justify-between items-center flex-col md:flex-row gap-2">
            {items && (
              <Dropdown
                menu={{
                  items,
                  selectable: true,
                  defaultSelectedKeys: ["1"],
                  onClick: (e) => {
                    selectHandler(e);
                  },
                  title: "Select Tag",
                }}
                className="border rounded-lg p-2 w-[10rem]"
              >
                <Typography.Link>
                  <Space>
                    Select Tag
                    <DownOutlined />
                  </Space>
                </Typography.Link>
              </Dropdown>
            )}
            <div className="flex justify-center gap-1 items-center w-[60%]"></div>
            {selectedFilter &&
              selectedFilter.map((ele, i) => {
                return (
                  <Tags
                    selectedFilter={selectedFilter}
                    setSelectedFilter={setSelectedFilter}
                    text={ele}
                    key={i}
                  />
                );
              })}
          </div>
          <Table
            columns={columns}
            dataSource={filteredData.length === 0 ? fetchedData : filteredData}
            className=" border-[1px] rounded-lg shadow-xl overflow-auto"
            pagination={false}
            footer={() => {
              return (
                <Pagination
                  defaultCurrent={skip / 10 + 1}
                  total={150}
                  onChange={handlePagination}
                  showSizeChanger={false}
                />
              );
            }}
          />
        </div>
      )}
    </>
  );
};
