import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom';
import { formatDate2 } from '../../utilities/Format';
import NotFound from '../NotFound'

const DetailArtikel = () => {
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
        <div className="container">
          <div className="row pl-32 pr-32 py-5" key={data.id}>
            <div className="col-md-18 justify-self-auto">
              <h1 className='text-3xl'>{data.judul}</h1>
              <p className='text-gray-400'>{data.penulis} {' / '} {formatDate2(data.updated_at)}</p>
              <img src={'https://api.gizibalita.com/img/' + data.image} className='max-w-full' />

              <div className="grid grid-cols-4 gap-4">
                <div className='col-span-4'>
                  <div dangerouslySetInnerHTML={{ __html: data.content }} className='mt-4' />
                </div>
              </div>
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

export default DetailArtikel
