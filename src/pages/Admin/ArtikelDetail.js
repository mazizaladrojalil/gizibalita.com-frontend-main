import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { formatDate2 } from '../../utilities/Format';
import NotFound from '../NotFound'

const ArtikelDetail = () => {
  const { id } = useParams();
  
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

   useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_BASE_URL}/api/artikel/${id}`)

      .then((response) => {
        const sortedData = response.data.data;
        setData(sortedData);
      })
      .catch((err) => {
        setIsLoading(false);
      });
  }, []);

  console.log(data);
  return (
   <>
    {
        isLoading && data &&
        <div class="max-w-md mx-auto bg-white overflow-hidden md:max-w-7xl">
          <div class="md:flex">
            <div class="md:shrink-0">
              <h1 className='text-3xl'>{data.judul}</h1>
              <p className='text-gray-400'>{data.penulis} {' / '} {formatDate2(data.updated_at)}</p>
              <img src={'https://api.gizibalita.com/img/' + data.image} className='max-w-full' />  
            </div>
          </div>
           <div class="md:flex">
            <div class="p-1">
              <div dangerouslySetInnerHTML={{ __html: data.content }} className="mt-2 text-slate-500" />
            </div>
          </div>
        </div>
      }
      {
        !isLoading && data.length === 0 && <NotFound/> 
      }
   </>
  )
}

export default ArtikelDetail
