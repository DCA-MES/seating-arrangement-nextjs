import React from 'react'
import { Button } from "antd";

function stdlist({ data ,setData  }    ) {
    const absent = (index) => {
		data[index].isPresent = !data[index].isPresent;
		setData([...data]);
        
	};
   
 

  return (
    <>
    <div className="flex lg:flex-row gap-4  sm:flex-col lg:mt-14 flex-wrap sm:mt-8">
				{data.map((student, index) => (
					<div
						className={` m-4 p-2 rounded-lg ${
							student.isPresent ? "bg-green-800" : "bg-red-800"
						}`}
					>
						<div className="flex flex-row items-center  justify-between">
							<div className="text-white font-serif ">
							<p>RegNo: {student.student.id}</p>
          <p>RollNo: {student.student.roll_number}</p>
          <p>Name: {student.student.name}</p>
          <p>SeatNumber: {student.seatNumber}</p>
          <p>
            Program: {student.exam.course.programCourses[0].program.name}
          </p>
		  <p> Course: {student.exam.course.name} </p>
							</div>
							{ student.isPresent ?
                            
                            <Button
								danger
								className="bg-white text-white "
								onClick={() => absent(index)}
							>
								Absent
							</Button>  :   
                            <Button
                            danger
                            className="bg-green-600 text-white"
                            onClick={() => absent(index)}
                        >
                            present
                        </Button>   }
						</div>
					</div>
				))}
			</div>
			<div>
				 
			</div>
    </>
  )
}

export default stdlist;