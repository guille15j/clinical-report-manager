package com.guillermo.clinical

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ClinicalReportManagerApplication

fun main(args: Array<String>) {
	runApplication<ClinicalReportManagerApplication>(*args)
}
