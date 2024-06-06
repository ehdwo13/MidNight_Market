package com.project.www.repository;

import org.apache.ibatis.annotations.Mapper;

import java.util.List;
import java.util.Map;

@Mapper
public interface AutoComMapper {
    List<Map<String, Object>> autocomplete(Map<String, Object> paramMap) throws Exception;
}