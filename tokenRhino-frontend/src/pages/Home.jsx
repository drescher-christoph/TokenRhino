import React from "react";
import SearchBar from "../components/Searchbar";
import logo from "../assets/logo.png";
import CategoryFilters from "../components/CategoryFilters";
import TokenCard from "../components/TokenCard";
import dummyTokens from "../../dummyToken";
import { usePresales } from "../hooks/usePresales";

const Home = () => {
  const { data: presales = [], isLoading, error } = usePresales()
  console.log('data:', presales, 'error:', error)

  const handleFilterChange = () => {}

  return (
    <div className="mx-auto max-w-7xl px-4 mt-38 sm:px-6 lg:px-8">
      {/* HERO SECTION */}
      <div className="flex flex-col justify-center items-center mb-10">
        <div className="text-center space-y-4 mt-8">
          {/* <img className="w-36 h-36 mx-auto" src={logo} alt="Logo" /> */}
          <h2 className="text-white font-extrabold text-5xl sm:text-6xl tracking-tight">
            Explore Live Token Presales
          </h2>
          <p className="text-[#9CA3AF] font-medium text-lg sm:text-xl max-w-2xl mx-auto">
            Join early-stage token launches — simple, secure & transparent.
          </p>
        </div>
        <div className="mt-10 sm:mt-12 lg:mt-14 w-full flex justify-center">
          <SearchBar />
        </div>
        <CategoryFilters onFilterChange={handleFilterChange} />
      </div>

      {/* Presale Token Listings */}
      <div className="grid grid-cols-4 gap-4 text-white">
        {isLoading && (
          <div className="col-span-4 text-center">Loading presales...</div>
        )}

        {error && (
          <div className="col-span-4 text-center text-red-500">
            Error loading presales: {error.message || 'Unknown error'}
          </div>
        )}

        {!isLoading && !error && presales.length === 0 && (
          <div className="col-span-4 text-center text-gray-400">
            No presales found.
          </div>
        )}

        {!isLoading &&
          !error &&
          presales.length > 0 &&
          presales.map((presale) => (
            <TokenCard
              key={presale.id}
              id={presale.id}
              logo={`https://avatars.dicebear.com/api/identicon/${presale.presale}.svg`}
              name={presale.tokenInfo?.name || 'Unknown Token'}
              symbol={presale.tokenInfo?.symbol || 'N/A'}
              price={Number(presale.tokensPerEth)} 
              change={'+12'}
              raised={presale.raised ? `${(Number(presale.raised) / 1e18).toFixed(2)} ETH` : '0 ETH'}
              goal={presale.hardCap ? `${(Number(presale.hardCap) / 1e18).toFixed(2)} ETH` : 'N/A'}
              metadataCID={presale.metadataCID}
              contract={presale.presale}
            />
          ))}
      </div>
    </div>
  )
}

export default Home